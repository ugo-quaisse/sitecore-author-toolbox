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
    <select name="queries" aria-labelledby="queries_label">
        <option value="query:.//*">Children of the current page</option>
        <option value="query:$site">Current site</option>
        <option value="query:$home">Home item of the current site</option>
        <option value="query:$tenant">Path to the current tenant</option>
        <option value="query:$compatibleThemes">Path to all themes</option>
        <option value="query:$theme">Currently used theme</option>
        <option value="query:$pageDesigns">Root of page designs</option>
        <option value="query:$partialDesigns">Root of partial designs</option>
        <option value="query:$currenttemplate">Name of the current template</option>
        <option value="query:$linkableHomes">Paths home items from linkable sites (see cross-site linking)</option>
        <option value="query:$templates">Home item of the current site</option>
        <option value="query:$siteMedia">Path to Virtual Media folder located under site</option>
        <option value="query:$sharedSites">For multiroot fields, resovles shared site for current tenant.</option>
        <option value="query:..">Parent item of the current page</option>
        <option value="query:../..">Parent of the parent item of the current page</option>
        <option value="query:$home//*">Every item under site home page</option>
        <option value="query:$home//*[@@name='News']">Every item under site home page with additional sorting applied</option>
        <option value="query:.//*[@@templatename='Page']">All items of the Page template under the current item</option>
        <option value="query:$site/*[@@name='Home']//*[@@templatename='Page']">All items of the Page template under the Home item of the current site</option>
        <option value="query:$site/*[@@name='Home']//*[@@name='News']/ancestor-or-self::*">Returns all ancestors of the News Item and the News Item itself</option>
        <option value="query:$rvSystemTemplates">list of templates defined in a configuration. Those template are used to feed AllowedInTemplates field for rendering variants</option>
        <option value="query:$xaRichTextProfile">XA.Foundation.Editing.DefaultRichTextProfile setting value.</option>
        </select>
    </datalist>`;
  if (storage.feature_contenteditor == true && template) {
    template.insertAdjacentHTML("beforeend", datalist);
    //Add autocomplete
    document.querySelectorAll("#TemplatePanel .scTableFieldSourceInput").forEach(function (elem) {
      console.log(elem);
      elem.setAttribute("list", "queries");
    });
  }
};
