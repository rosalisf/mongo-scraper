$(".clickable").on("click", function() {
  console.log(
    $(this)
      .parent()
      .attr("data-id"),
    $(this)
      .parent()
      .parent()
      .attr("data-id")
  );
});
