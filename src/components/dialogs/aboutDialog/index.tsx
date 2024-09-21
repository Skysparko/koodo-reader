import { connect } from "react-redux";
import { handleSetting, handleAbout } from "../../../store/actions";
import { stateType } from "../../../store";
import AboutDialog from "./component";
import { withTranslation } from "react-i18next";
import { withCookies } from "react-cookie";

const mapStateToProps = (state: stateType) => {
  return {
    isSettingOpen: state.manager.isSettingOpen,
    isAboutOpen: state.manager.isAboutOpen,
    isNewWarning: state.manager.isNewWarning,
    books: state.manager.books,
    notes: state.reader.notes,
    deletedBooks: state.manager.deletedBooks,
  };
};
const actionCreator = {
  handleSetting,
  handleAbout,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(withCookies(AboutDialog)) as any);
