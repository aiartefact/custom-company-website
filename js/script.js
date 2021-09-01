document.addEventListener("DOMContentLoaded",
    function () {

      const menuToggle = document.getElementById('collapsable-nav');
      const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false});

      document.querySelector(".navbar-toggler")
          .addEventListener("blur",
              function (event) {
                var screenWidth = window.innerWidth;
                if (screenWidth < 768) {
                    bsCollapse.toggle();
                }
              });
    });

(function (global) {

  var ccw = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "data/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var catalogItemsUrl = "data/catalog/";
  var catalogItemsTitleHtml = "snippets/catalog-items-title.html";
  var catalogItemHtml = "snippets/catalog-item.html";
  var awardsUrl = "data/awards.json";
  var awardsTitleHtml = "snippets/awards-title-snippet.html";
  var awardsFooterHtml = "snippets/awards-footer-snippet.html";
  var awardHtmlOdd = "snippets/awards-item-odd.html";
  var awardHtmlEven = "snippets/awards-item-even.html";
  var aboutHtml = "snippets/about-snippet.html";

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

  // Return substitute of '{{propName}}' with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  // Clear the class 'active' from selectedButtonSelector button
  var removeActiveFromSelectedButton = function (selectedButtonSelector) {
    var classes = document.querySelector(selectedButtonSelector).className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector(selectedButtonSelector).className = classes;
  };

  // Clear the class 'active' from all buttons and
  // switch to selectedButtonSelector button
  // If selectedButtonSelector is undefined then
  // clear the class 'active' from all buttons
  var switchSelectedToActive = function (selectedButtonSelector) {
    //Remove 'active' from Home button
    removeActiveFromSelectedButton("#navHomeButton");
    //Remove 'active' from Catalog button
    removeActiveFromSelectedButton("#navCatalogButton");
    //Remove 'active' from About button
    removeActiveFromSelectedButton("#navAboutButton");
    //Remove 'active' from Awards button
    removeActiveFromSelectedButton("#navAwardsButton");

    // If selectedButtonSelector is not undefined then
    // add 'active' to selectedButtonSelector button
    if (selectedButtonSelector !== undefined) {
      var classes = document.querySelector(selectedButtonSelector).className;
      if (classes.indexOf("active") === -1) {
        classes += " active";
        document.querySelector(selectedButtonSelector).className = classes;
      }
    }
  };

  // Load the Home view
  ccw.loadHomeView = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          // Switch CSS class active to Home button
          switchSelectedToActive("#navHomeButton");
          document.querySelector("#main-content")
              .innerHTML = responseText;
        },
        false);
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {

    // On first load, show Home view
    ccw.loadHomeView();
  });

  // Load the Catalog categories view
  ccw.loadCatalogCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        buildAndShowCategoriesHTML);
  };

  // Load the Catalog items view 'categoryShort' is a short_name for a category
  ccw.loadCatalogItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        catalogItemsUrl + categoryShort + ".json",
        buildAndShowCatalogItemsHTML);
  };

  // Load the Awards view
  ccw.loadAwardsItems = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        awardsUrl,
        buildAndShowAwardsItemsHTML);
  };

  // Load the About view
  ccw.loadAboutView = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        aboutHtml,
        function (responseText) {
          // Switch CSS class active to About button
          switchSelectedToActive("#navAboutButton");
          document.querySelector("#main-content")
              .innerHTML = responseText;
        },
        false);
  };


  // Builds HTML for the categories page based on the data from the server
  function buildAndShowCategoriesHTML (categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {
          // Retrieve single category snippet
          $ajaxUtils.sendGetRequest(
              categoryHtml,
              function (categoryHtml) {
                // Switch CSS class active to Catalog button
                switchSelectedToActive("#navCatalogButton");

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
    // Load title snippet of Catalog items page
    $ajaxUtils.sendGetRequest(
        catalogItemsTitleHtml,
        function (catalogItemsTitleHtml) {
          // Retrieve single Catalog item snippet
          $ajaxUtils.sendGetRequest(
              catalogItemHtml,
              function (catalogItemHtml) {
                // Switch CSS class active to Catalog button
                switchSelectedToActive();

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


  // Using category and Catalog items data and snippets html
  // build Catalog items view HTML to be inserted into page
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

    // Loop over Catalog items
    var catalogItems = categoryCatalogItems.catalog_items;
    var catShortName = categoryCatalogItems.category.short_name;
    for (var i = 0; i < catalogItems.length; i++) {
      // Insert Catalog item values
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

  // Builds HTML for the awards page based on the data from the server
  function buildAndShowAwardsItemsHTML (awards) {
    // Load title snippet of Awards page
    $ajaxUtils.sendGetRequest(
        awardsTitleHtml,
        function (awardsTitleHtml) {
          // Load footer snippet of Awards page
          $ajaxUtils.sendGetRequest(
            awardsFooterHtml,
              function (awardsFooterHtml) {
                // Retrieve single awards odd snippet
                $ajaxUtils.sendGetRequest(
                    awardHtmlOdd,
                    function (awardHtmlOdd) {
                      // Retrieve single awards even snippet
                      $ajaxUtils.sendGetRequest(
                          awardHtmlEven,
                          function (awardHtmlEven) {
                            // Switch CSS class active to Awards button
                            switchSelectedToActive("#navAwardsButton");

                            var awardsViewHtml =
                                buildAwardsViewHtml(awards,
                                    awardsTitleHtml,
                                    awardsFooterHtml,
                                    awardHtmlOdd,
                                    awardHtmlEven);
                            insertHtml("#main-content", awardsViewHtml);
                          },
                      false);
                    },
                false);
              },
          false);
        },
        false);
  }

  // Using awards data and snippets html
  // build awards view HTML to be inserted into page
  function buildAwardsViewHtml(awards,
                               awardsTitleHtml,
                               awardsFooterHtml,
                               awardHtmlOdd,
                               awardHtmlEven) {

    var finalHtml = awardsTitleHtml;
    finalHtml += "<section class='row'>";

    var html = "";

    // Loop over awards
    for (var i = 0; i < awards.length; i++) {
      // Insert awards values
      // Check for odd
      if ((i+1) % 2 === 1) {
        html = awardHtmlOdd;
      }
      else {
        html = awardHtmlEven;
      }
      var name = "" + awards[i].name;
      var description = awards[i].description;
      html =
          insertProperty(html,
              "name",
              name);
      html =
          insertProperty(html,
              "description",
              description);
      finalHtml += html;
    }

    finalHtml += "</section>";
    finalHtml += awardsFooterHtml;
    return finalHtml;
  }


  global.$ccw = ccw;

})(window);