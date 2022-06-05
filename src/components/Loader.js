import { bool } from "prop-types"

const Loader = ({ isContent }) => {
  return (
    <div className={`circle-loader ${isContent ? "circle-loader-content" : ""}`}>
      <div></div>
      <div></div>
    </div>
  )
}
Loader.propTypes = {
  isContent: bool.isRequired,
}
export default Loader
