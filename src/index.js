"use strict"

var happens = require("happens");

var pages = [];
var pageIndex = 0;
var currentPageIndex = 0
var data = undefined;

var options = {
  itemsPerPage: 1
};

var api = {};

module.exports = function(items, opts)
{
  data = items;
  happens(api);

  if(opts && opts.itemsPerPage)
    options.itemsPerPage = opts.itemsPerPage

  createPages();

  api.next = next;
  api.prev = prev;
  api.go = go;

  return api;
}

function createPages()
{
  var dataLength = data.length;

  pages[pageIndex] = []

  for(var i = 0; i < dataLength; i++)
  {
    if(i > 0 && i % options.itemsPerPage === 0)
    {
      pageIndex++
      pages[pageIndex] = []
    }
    pages[pageIndex].push(data[i]);
  }

  api.totalPages = pages.length;
}

function next()
{
  currentPageIndex++
  checkNextPrev()
  api.emit("change", pages[currentPageIndex], currentPageIndex);
  api.emit("next", pages[currentPageIndex], currentPageIndex);
}

function prev()
{
  currentPageIndex--
  checkNextPrev()
  api.emit("change", pages[currentPageIndex], currentPageIndex);
  api.emit("prev", pages[currentPageIndex], currentPageIndex);
}

function checkNextPrev()
{
  if(currentPageIndex > pages.length - 1)
  {
    currentPageIndex = 0;
  }

  if(currentPageIndex < 0)
  {
    currentPageIndex = pages.length - 1;
  }
}

function go(at)
{
  currentPageIndex = at;
  checkNextPrev()
  api.emit("change", pages[currentPageIndex], currentPageIndex);
  api.emit("go", pages[currentPageIndex], currentPageIndex);
}
