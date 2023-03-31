import path from "path";
import url from "url";
import fs from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "./src/content/");

let postList = [];

const getPost = async () => {
  await fs.readdir(dirPath, (err, files) => {
    if (err) return console.log("failed to list files: " + err);

    files.forEach((file, ind) => {
      let post,
        obj = {};

      fs.readFile(`${dirPath}/${file}`, "utf-8", (err, contents) => {
        // const lines = contents.split("---");
        // console.log(lines[1]);

        const getMetadataIndices = (acc, elem, i) => {
          if (/^---/.test(elem)) acc.push(i);
          return acc;
        };

        const parseMetaData = (lines, metaDataIndices) => {
          if (metaDataIndices.length === 2) {
            let metaData = lines.slice(
              metaDataIndices[0] + 1,
              metaDataIndices[1]
            );
            metaData.forEach((line) => {
              obj[line.split(": ")[0]] = line.split(": ")[1];
            });

            return obj;
          }
        };

        const parseContent = (lines, metaDataIndices) => {
          if (metaDataIndices.length === 2)
            lines = lines.slice(metaDataIndices[1] + 1, lines.length);

          return lines.join("\n");
        };

        const lines = contents.split("\n");
        const metaDataIndices = lines.reduce(getMetadataIndices, []);
        const metaData = parseMetaData(lines, metaDataIndices);
        const content = parseContent(lines, metaDataIndices);

        post = {
          id: ind + 1,
          title: metaData.title ? metaData.title : "No Title",
          author: metaData.author ? metaData.author : "No Author",
          date: metaData.date ? metaData.date : "No Data",
          content: content ? content : "No Content present",
        };

        postList.push(post);
      });
    });
  });

  setTimeout(() => {
    console.log(postList);
  }, 500);
};

getPost();
