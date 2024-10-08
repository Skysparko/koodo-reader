import {
    handleFetchNotes,
    handleFetchBookmarks,
    handleFetchBooks,
    handleReadingBook,
    handleFetchPercentage,
} from "../../../store/actions";
import { connect } from "react-redux";
import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import Login from "./component";
import { withCookies } from "react-cookie";

const mapStateToProps = (state: stateType) => {
    return {
        currentBook: state.book.currentBook,
        percentage: state.progressPanel.percentage,
        htmlBook: state.reader.htmlBook,
    };
};
const actionCreator = {
    handleFetchNotes,
    handleFetchBookmarks,
    handleFetchBooks,
    handleReadingBook,
    handleFetchPercentage,
};
export default connect(
    mapStateToProps,
    actionCreator
)(withTranslation()(withCookies(Login)) as any);
