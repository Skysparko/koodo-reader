import React from "react";
import "./importLocal.css";
import BookModel from "../../models/Book";
import { fetchMD5 } from "../../utils/fileUtils/md5Util";
import { Trans } from "react-i18next";
import Dropzone from "react-dropzone";

import { ImportLocalProps, ImportLocalState } from "./interface";
import RecordRecent from "../../utils/readUtils/recordRecent";
import { isElectron } from "react-device-detect";
import { withRouter } from "react-router-dom";
import BookUtil from "../../utils/fileUtils/bookUtil";
import toast from "react-hot-toast";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import ShelfUtil from "../../utils/readUtils/shelfUtil";
import { fetchFileFromPath } from "../../utils/fileUtils/fileUtil";
import axios from "axios";
import { handleBookFetching } from "../../store/actions";
import { ReactCookieProps } from "react-cookie";
import axiosInstance from "../../config/axios.config";

declare var window: any;

let clickFilePath = "";


class ImportLocal extends React.Component<ImportLocalProps, ImportLocalState, ReactCookieProps> {
  constructor(props: ImportLocalProps) {
    super(props);
    this.state = {
      isOpenFile: false,
      width: document.body.clientWidth,
    };
  }

  componentDidMount() {
    this.fetchBooksAutomatically(); // Call the new function on load
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      if (!localStorage.getItem("storageLocation")) {
        localStorage.setItem(
          "storageLocation",
          ipcRenderer.sendSync("storage-location", "ping")
        );
      }

      const filePath = ipcRenderer.sendSync("get-file-data");
      if (filePath && filePath !== ".") {
        this.handleFilePath(filePath);
      }
      window.addEventListener(
        "focus",
        (event) => {
          const _filePath = ipcRenderer.sendSync("get-file-data");
          if (_filePath && _filePath !== ".") {
            this.handleFilePath(_filePath);
          }
        },
        false
      );
    }
    window.addEventListener("resize", () => {
      this.setState({ width: document.body.clientWidth });
    });
  }

  fetchBooksAutomatically = async () => {
    await window.localforage.clear()
    await window.localStorage.clear()
    const res = await axiosInstance.get("/assign-book");
    const books = res?.data?.books
    await this.handleFilesFromUrls(books);
    setTimeout(() => {
      this.props.history.push("/manager/home");
      handleBookFetching(false)
    }, 500);
  };

  handleFilePath = async (filePath: string) => {
    clickFilePath = filePath;
    let md5 = await fetchMD5(await fetchFileFromPath(filePath));
    if ([...(this.props.books || []), ...this.props.deletedBooks].length > 0) {
      let isRepeat = false;
      let repeatBook: BookModel | null = null;
      [...(this.props.books || []), ...this.props.deletedBooks].forEach(
        (item) => {
          if (item.md5 === md5) {
            isRepeat = true;
            repeatBook = item;
          }
        }
      );
      if (isRepeat && repeatBook) {
        this.handleJump(repeatBook);
        return;
      }
    }
    const fileTemp = await fetchFileFromPath(filePath);

    this.setState({ isOpenFile: true }, async () => {
      await this.getMd5WithBrowser(fileTemp);
    });
  };

  // New method to fetch the file from an array of URLs
  handleFilesFromUrls = async (books: Array<{id:string,url:string;author:string;title:string}>) => {
    for (const book of books) {
      await this.handleFileFromUrl(book.url);
    }
    toast.success(this.props.t("All books imported successfully!"));
    
  };

  handleFileFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error(this.props.t("Failed to fetch the file"));
        return;
      }

      const blob = await response.blob();
      const file = new File([blob], url.split("/").pop() || "downloadedFile");
      clickFilePath = url; // Store URL as the file path reference
      await this.handleFileBlob(file);
    } catch (error) {
      console.error("Error fetching file from URL", error);
      toast.error(this.props.t("Failed to fetch the file from URL"));
    }
  };

  handleFileBlob = async (file: File) => {
    let md5 = await fetchMD5(file);
    if ([...(this.props.books || []), ...this.props.deletedBooks].length > 0) {
      let isRepeat = false;
      let repeatBook: BookModel | null = null;
      [...(this.props.books || []), ...this.props.deletedBooks].forEach(
        (item) => {
          if (item.md5 === md5) {
            isRepeat = true;
            repeatBook = item;
          }
        }
      );
      if (isRepeat && repeatBook) {
        this.handleJump(repeatBook);
        return;
      }
    }

    this.setState({ isOpenFile: true }, async () => {
      await this.getMd5WithBrowser(file);
    });
  };

  handleJump = (book: BookModel) => {
    localStorage.setItem("tempBook", JSON.stringify(book));
    BookUtil.RedirectBook(book, this.props.t, this.props.history);
    this.props.history.push("/manager/home");
  };

  handleAddBook = (book: BookModel, buffer: ArrayBuffer) => {
    return new Promise<void>((resolve) => {
      if (this.state.isOpenFile) {
        if (
          StorageUtil.getReaderConfig("isImportPath") !== "yes" &&
          StorageUtil.getReaderConfig("isPreventAdd") !== "yes"
        ) {
          BookUtil.addBook(book.key, buffer);
        }

        if (StorageUtil.getReaderConfig("isPreventAdd") === "yes") {
          this.handleJump(book);
          this.setState({ isOpenFile: false });
          return resolve();
        }
      } else {
        StorageUtil.getReaderConfig("isImportPath") !== "yes" &&
          BookUtil.addBook(book.key, buffer);
      }

      let bookArr = [...(this.props.books || []), ...this.props.deletedBooks];
      bookArr.push(book);
      this.props.handleReadingBook(book);
      RecordRecent.setRecent(book.key);
      window.localforage
        .setItem("books", bookArr)
        .then(() => {
          this.props.handleFetchBooks();
          if (this.props.mode === "shelf") {
            let shelfTitles = Object.keys(ShelfUtil.getShelf());
            ShelfUtil.setShelf(shelfTitles[this.props.shelfIndex], book.key);
          }
          // toast.success(this.props.t("Addition successful"));
          this.setState({ isOpenFile: false });
          resolve();
        })
        .catch(() => {
          toast.error(this.props.t("Import failed"));
          resolve();
        });
    });
  };

  getMd5WithBrowser = async (file: File) => {
    const md5 = await fetchMD5(file);
    if (!md5) {
      toast.error(this.props.t("Import failed"));
      return;
    }
    await this.handleBook(file, md5);
  };

  handleBook = async (file: File, md5: string) => {
    let extension = (file.name as string)
      .split(".")
      .reverse()[0]
      .toLocaleLowerCase();
    let bookName = file.name.substr(0, file.name.length - extension.length - 1);

    let isRepeat = false;
    if (this.props.books.some((item) => item.md5 === md5 && item.size === file.size)) {
      isRepeat = true;
      toast.error(this.props.t("Duplicate book"));
      return;
    }
    if (this.props.deletedBooks.some((item) => item.md5 === md5 && item.size === file.size)) {
      isRepeat = true;
      toast.error(this.props.t("Duplicate book in trash bin"));
      return;
    }
    
    if (!isRepeat) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const file_content = (e.target as any).result;
        try {
          const result = await BookUtil.generateBook(
            bookName,
            extension,
            md5,
            file.size,
            clickFilePath, // This will be the URL in this case
            file_content
          );
          if (result === "get_metadata_error") {
            toast.error(this.props.t("Import failed"));
            return;
          }
          await this.handleAddBook(result as BookModel, file_content as ArrayBuffer);
        } catch (error) {
          console.error(error);
        }
      };
    }
  };

  render() {
    if(isElectron){
      return (
        <Dropzone
          onDrop={async (acceptedFiles) => {
            this.props.handleDrag(false);
            for (let item of acceptedFiles) {
              await this.getMd5WithBrowser(item);
            }
          }}
          accept={[
            ".epub",
            ".pdf",
            ".txt",
            ".mobi",
            ".azw3",
            ".azw",
            ".htm",
            ".html",
            ".xml",
            ".xhtml",
            ".mhtml",
            ".docx",
            ".md",
            ".fb2",
            ".cbz",
            ".cbt",
            ".cbr",
            ".cb7",
          ]}
          multiple={true}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="import-from-local"
              {...getRootProps()}
              style={
                this.props.isCollapsed && document.body.clientWidth < 950
                  ? { width: "42px" }
                  : {}
              }
            >
              <div className="animation-mask-local"></div>
              {this.props.isCollapsed && this.state.width < 950 ? (
                <span
                  className="icon-folder"
                  style={{ fontSize: "15px", fontWeight: 500 }}
                ></span>
              ) : (
                <span>
                  <Trans>Import</Trans>
                </span>
              )}
  
              <input
                type="file"
                id="import-book-box"
                className="import-book-box"
                name="file"
                {...getInputProps()}
              />
            </div>
          )}
        </Dropzone>
      );
    }else{
      return null
    }
  }
}

export default withRouter(ImportLocal as any);
