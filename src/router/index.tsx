import React, { useEffect } from "react";
import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import Manager from "../pages/manager";
import HtmlReader from "../pages/htmlReader";
import PDFReader from "../pages/pdfReader";
import _Redirect from "../pages/redirect";
import i18n from "../i18n";
import StorageUtil from "../utils/serviceUtils/storageUtil";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import { useCookies } from "react-cookie";

const Router = () => {
  const [cookies, setCookie] = useCookies(['token']);

  const AuthRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        cookies.token ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );

  const GuestRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        !cookies.token ? <Component {...props} /> : <Redirect to="/manager" />
      }
    />
  );
  useEffect(() => {
    const lng = StorageUtil.getReaderConfig("lang");

    if (lng) {
      //Compatile with 1.6.0 and older
      if (lng === "zh") {
        i18n.changeLanguage("zhCN");
      } else if (lng === "cht") {
        i18n.changeLanguage("zhTW");
      } else {
        i18n.changeLanguage(lng);
      }
    } else {
      if (navigator.language === "zh-CN" || navigator.language === "zh-SG") {
        i18n.changeLanguage("zhCN");
        StorageUtil.setReaderConfig("lang", "zhCN");
      } else if (
        navigator.language === "zh-TW" ||
        navigator.language === "zh-HK"
      ) {
        i18n.changeLanguage("zhTW");
        StorageUtil.setReaderConfig("lang", "zhTW");
      } else if (navigator.language === "zh-MO") {
        i18n.changeLanguage("zhMO");
        StorageUtil.setReaderConfig("lang", "zhMO");
      } else if (navigator.language.startsWith("ro")) {
        i18n.changeLanguage("ro");
        StorageUtil.setReaderConfig("lang", "ro");
      } else if (navigator.language.startsWith("ru")) {
        i18n.changeLanguage("ru");
        StorageUtil.setReaderConfig("lang", "ru");
      } else if (navigator.language.startsWith("ja")) {
        i18n.changeLanguage("ja");
        StorageUtil.setReaderConfig("lang", "ja");
      } else if (navigator.language.startsWith("bo")) {
        i18n.changeLanguage("bo");
        StorageUtil.setReaderConfig("lang", "bo");
      } else if (navigator.language.startsWith("hy")) {
        i18n.changeLanguage("hy");
        StorageUtil.setReaderConfig("lang", "hy");
      } else if (navigator.language.startsWith("hu")) {
        i18n.changeLanguage("hu");
        StorageUtil.setReaderConfig("lang", "hu");
      } else if (navigator.language.startsWith("hi")) {
        i18n.changeLanguage("hi");
        StorageUtil.setReaderConfig("lang", "hi");
      } else if (navigator.language.startsWith("id")) {
        i18n.changeLanguage("id");
        StorageUtil.setReaderConfig("lang", "id");
      } else if (navigator.language.startsWith("bg")) {
        i18n.changeLanguage("bg");
        StorageUtil.setReaderConfig("lang", "bg");
      } else if (navigator.language.startsWith("it")) {
        i18n.changeLanguage("it");
        StorageUtil.setReaderConfig("lang", "it");
      } else if (navigator.language.startsWith("nl")) {
        i18n.changeLanguage("nl");
        StorageUtil.setReaderConfig("lang", "nl");
      } else if (navigator.language.startsWith("bn")) {
        i18n.changeLanguage("bn");
        StorageUtil.setReaderConfig("lang", "bn");
      } else if (navigator.language.startsWith("th")) {
        i18n.changeLanguage("th");
        StorageUtil.setReaderConfig("lang", "th");
      } else if (navigator.language.startsWith("tr")) {
        i18n.changeLanguage("tr");
        StorageUtil.setReaderConfig("lang", "tr");
      } else if (navigator.language.startsWith("ar")) {
        i18n.changeLanguage("ar");
        StorageUtil.setReaderConfig("lang", "ar");
      } else if (navigator.language.startsWith("fr")) {
        i18n.changeLanguage("fr");
        StorageUtil.setReaderConfig("lang", "fr");
      } else if (navigator.language.startsWith("es")) {
        i18n.changeLanguage("es");
        StorageUtil.setReaderConfig("lang", "es");
      } else if (navigator.language.startsWith("pt")) {
        i18n.changeLanguage("ptBR");
        StorageUtil.setReaderConfig("lang", "ptBR");
      } else if (navigator.language.startsWith("fa")) {
        i18n.changeLanguage("fa");
        StorageUtil.setReaderConfig("lang", "fa");
      } else if (navigator.language.startsWith("cs")) {
        i18n.changeLanguage("cs");
        StorageUtil.setReaderConfig("lang", "cs");
      } else if (navigator.language.startsWith("de")) {
        i18n.changeLanguage("de");
        StorageUtil.setReaderConfig("lang", "de");
      } else if (navigator.language.startsWith("pl")) {
        i18n.changeLanguage("pl");
        StorageUtil.setReaderConfig("lang", "pl");
      } else {
        i18n.changeLanguage("en");
        StorageUtil.setReaderConfig("lang", "en");
      }
    }
  }, []);
  return (
    <HashRouter>
      <Switch>
        <GuestRoute component={Login} path="/" exact />
        <GuestRoute component={Register} path="/register"  />
        <AuthRoute component={Manager} path="/manager" />
        <AuthRoute component={HtmlReader} path="/epub" />
        <AuthRoute component={HtmlReader} path="/mobi" />
        <AuthRoute component={HtmlReader} path="/cbr" />
        <AuthRoute component={HtmlReader} path="/cbt" />
        <AuthRoute component={HtmlReader} path="/cbz" />
        <AuthRoute component={HtmlReader} path="/cb7" />
        <AuthRoute component={HtmlReader} path="/azw3" />
        <AuthRoute component={HtmlReader} path="/azw" />
        <AuthRoute component={HtmlReader} path="/txt" />
        <AuthRoute component={HtmlReader} path="/docx" />
        <AuthRoute component={HtmlReader} path="/md" />
        <AuthRoute component={HtmlReader} path="/fb2" />
        <AuthRoute component={HtmlReader} path="/html" />
        <AuthRoute component={HtmlReader} path="/htm" />
        <AuthRoute component={HtmlReader} path="/xml" />
        <AuthRoute component={HtmlReader} path="/xhtml" />
        <AuthRoute component={HtmlReader} path="/mhtml" />
        <AuthRoute component={HtmlReader} path="/href" />
        <AuthRoute component={PDFReader} path="/pdf" />
        <AuthRoute component={_Redirect} path="/redirect" />
      </Switch>
    </HashRouter>
  );
};

export default Router;
