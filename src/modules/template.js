/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

export { initQuerySuggestions };

/**
 *  Add query suggestions to tempalate source field
 */
const initQuerySuggestions = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  let template = document.querySelector("#TemplatePanel");

  let datalist = `
    <datalist id="queries">
    <select name="queries">
        <option value="query:.//*">[SXA] Children of the current page</option>
        <option value="query:$site">[SXA] Current site</option>
        <option value="query:$home">[SXA] Home item of the current site</option>
        <option value="query:$tenant">[SXA] Path to the current tenant</option>
        <option value="query:$compatibleThemes">[SXA] Path to all themes</option>
        <option value="query:$theme">[SXA] Currently used theme</option>
        <option value="query:$pageDesigns">[SXA] Root of page designs</option>
        <option value="query:$partialDesigns">[SXA] Root of partial designs</option>
        <option value="query:$currenttemplate">[SXA] Name of the current template</option>
        <option value="query:$linkableHomes">[SXA] Paths home items from linkable sites (cross-site linking)</option>
        <option value="query:$templates">[SXA] Home item of the current site</option>
        <option value="query:$siteMedia">[SXA] Path to Virtual Media folder located under site</option>
        <option value="query:$sharedSites">[SXA] For multiroot fields, resovles shared site for current tenant.</option>
        <option value="query:..">[SXA] Parent item of the current page</option>
        <option value="query:../..">[SXA] Parent of the parent item of the current page</option>
        <option value="query:$home//*">[SXA] Every item under site home page</option>
        <option value="query:$home//*[@@name='News']">[SXA] Every item under site home page with additional sorting applied</option>
        <option value="query:.//*[@@templatename='Page']">[SXA] All items of the Page template under the current item</option>
        <option value="query:$site/*[@@name='Home']//*[@@templatename='Page']">[SXA] All items of the Page template under the Home item of the current site</option>
        <option value="query:$site/*[@@name='Home']//*[@@name='News']/ancestor-or-self::*">[SXA] Returns all ancestors of the News Item and the News Item itself</option>
        <option value="query:$rvSystemTemplates">[SXA] List of templates defined in a configuration.</option>
        <option value="query:$xaRichTextProfile">[SXA] XA.Foundation.Editing.DefaultRichTextProfile setting value.</option>
        </select>
    </datalist>`;
  if (storage.feature_contenteditor == true && template) {
    template.insertAdjacentHTML("beforeend", datalist);
    //Add autocomplete
    document.querySelectorAll("#TemplatePanel .scTableFieldSourceInput").forEach(function (elem) {
      elem.setAttribute("list", "queries");
    });
  }
};
