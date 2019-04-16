module.exports = function(program) {
  program
    .command("post")
    .usage('"My new post" tag1 tag2 tag3')
    .description("Create a new blog post with today's date.")
    .arguments("[title] [tags...]")
    .action(function(title, tags) {
      console.log(arguments);
    });
};
