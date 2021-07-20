document.addEventListener("DOMContentLoaded",
    function () {

      document.querySelector(".navbar-toggler")
          .addEventListener("blur",
              function (event) {
                var screenWidth = window.innerWidth;
                if (screenWidth < 768) {
                  //document.getElementById("collapsable-nav").classList.remove("show");
                  //let tempCollapse = new bootstrap.Collapse(document.getElementById("collapsable-nav"),{toggle: true});
                  $("#collapsable-nav").collapse('hide');
                  // document.querySelector("#collapsable-nav").collapse('hide');
                  // document.querySelector("#collapsable-nav").;
                  // console.log(Object.getOwnPropertyNames(document.querySelector("#collapsable-nav")));
                }
              });
    });

(function (global) {

  var ns = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "data/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var catalogItemsUrl = "data/catalog/";
  var catalogItemsTitleHtml = "snippets/catalog-items-title.html";
  var catalogItemHtml = "snippets/catalog-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif' alt='loading'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  // Remove the class 'active' from home and switch to Menu button
  var switchCatalogToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navCatalogButton").className;
    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navCatalogButton").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {

    // On first load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          document.querySelector("#main-content")
              .innerHTML = responseText;
        },
        false);
  });

  // Load the catalog categories view
  ns.loadCatalogCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        buildAndShowCategoriesHTML);
  };

  // Load the catalog items view
  // 'categoryShort' is a short_name for a category
  ns.loadCatalogItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        catalogItemsUrl + categoryShort + ".json",
        buildAndShowCatalogItemsHTML);
  };


  // Builds HTML for the categories page based on the data
  // from the server
  function buildAndShowCategoriesHTML (categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {
          // Retrieve single category snippet
          $ajaxUtils.sendGetRequest(
              categoryHtml,
              function (categoryHtml) {
                // Switch CSS class active to menu button
                switchCatalogToActive();

                var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                        categoriesTitleHtml,
                        categoryHtml);
                insertHtml("#main-content", categoriesViewHtml);
              },
              false);
        },
        false);
  }


  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml) {

    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html =
          insertProperty(html, "name", name);
      html =
          insertProperty(html,
              "short_name",
              short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on the data
  // from the server
  function buildAndShowCatalogItemsHTML (categoryCatalogItems) {
    // Load title snippet of catalog items page
    $ajaxUtils.sendGetRequest(
        catalogItemsTitleHtml,
        function (catalogItemsTitleHtml) {
          // Retrieve single catalog item snippet
          $ajaxUtils.sendGetRequest(
              catalogItemHtml,
              function (catalogItemHtml) {
                // Switch CSS class active to menu button
                switchCatalogToActive();

                var catalogItemsViewHtml =
                    buildCatalogItemsViewHtml(categoryCatalogItems,
                        catalogItemsTitleHtml,
                        catalogItemHtml);
                insertHtml("#main-content", catalogItemsViewHtml);
              },
              false);
        },
        false);
  }


  // Using category and catalog items data and snippets html
  // build catalog items view HTML to be inserted into page
  function buildCatalogItemsViewHtml(categoryCatalogItems,
                                     catalogItemsTitleHtml,
                                     catalogItemHtml) {

    catalogItemsTitleHtml =
        insertProperty(catalogItemsTitleHtml,
            "name",
            categoryCatalogItems.category.name);
    catalogItemsTitleHtml =
        insertProperty(catalogItemsTitleHtml,
            "special_instructions",
            categoryCatalogItems.category.special_instructions);

    var finalHtml = catalogItemsTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over catalog items
    var catalogItems = categoryCatalogItems.catalog_items;
    var catShortName = categoryCatalogItems.category.short_name;
    for (var i = 0; i < catalogItems.length; i++) {
      // Insert catalog item values
      var html = catalogItemHtml;
      html =
          insertProperty(html, "short_name", catalogItems[i].short_name);
      html =
          insertProperty(html,
              "catShortName",
              catShortName);
      html =
          insertItemPrice(html,
              "price_retail",
              catalogItems[i].price_retail);
      html =
          insertItemAmount(html,
              "amount_retail",
              catalogItems[i].amount_retail);
      html =
          insertItemPrice(html,
              "price_wholesale",
              catalogItems[i].price_wholesale);
      html =
          insertItemAmount(html,
              "amount_wholesale",
              catalogItems[i].amount_wholesale);
      html =
          insertProperty(html,
              "name",
              catalogItems[i].name);
      html =
          insertProperty(html,
              "description",
              catalogItems[i].description);

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }


  // Appends price with '$' if price exists
  function insertItemPrice(html,
                           pricePropName,
                           priceValue) {
    // If not specified, replace with empty string
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }


  // Appends portion name in parens if it exists
  function insertItemAmount(html,
                            amountPropName,
                            amountValue) {
    // If not specified, return original string
    if (!amountValue) {
      return insertProperty(html, amountPropName, "");
    }

    amountValue = "(" + amountValue + ")";
    html = insertProperty(html, amountPropName, amountValue);
    return html;
  }


  global.$ns = ns;

})(window);