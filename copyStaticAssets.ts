import * as shell from "shelljs";

shell.cp("-R", "src/public/js", "dist/public/");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/public/css", "dist/public/");
shell.cp("-R", "src/public/media", "dist/public/");
