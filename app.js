const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true
    });

    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
mongoose.set('strictQuery', false);
// mongoose.set('bufferCommands', false);
const articleSchema = {
    title: {
        type: String

    },
    content: {
        type: String
    }

};

const Article = mongoose.model("Article", articleSchema);

// const Article1 = new Article({
//     title: "Love",
//     content: "Love is everyWhere"
// });

// const Article2 = new Article({
//     title: "Friends",
//     content: "I love my Friends"
// });
// const Article3 = new Article({
//     title: "Nature",
//     content: "I love Nature "
// });

// const allArticle = [Article1, Article2, Article3];
// Article.insertMany(function (err) {
//     if (err) {
//         console.log(err)
//     } else {
//         res.send(allArticle);
//         console.log(allArticle);
//     }
// });
// res.send("Success");


app.route("/article")
    .get((req, res) => {
        Article.find({}, (err, foundArticle) => {
            !err ? res.send(foundArticle) : res.send(err)

        });
    })
    .post((req, res) => {
        const testArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        testArticle.save(err => {
            err ? console.log(err) : res.send("success") && console.log("success")

        })


    })
    .delete((req, res) => {
        Article.deleteMany((err, foundedDetails) => !err ? res.send(foundedDetails) : res.send(err))
    });
///////////////////////////////////////////////Request Targeting Specific Article///////////////////////////////////////////////////


app.route("/article/:articleTitle")
    .get((req, res) => {
        Article.findOne({
                title: _.capitalize(req.params.articleTitle)
            },
            (err, foundArticle) => !err ? res.send(foundArticle) : res.send("No Articles matching that title was found"));
    })
    .put((req, res) => {
        Article.findOneAndUpdate({
                title: _.capitalize(req.params.articleTitle)
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            err => !err ? res.send("Suceessfully added your data") : res.send(err));
    })
    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            err => !err ? res.send("Suceessfully updated using patch method") : res.send(err));
    })

    .delete((req, res) => {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            err => !err ? res.send("Suceessfully deleted") : res.send(err));
    });






app.listen(3000, (req, res) => {
    console.log("Your server is running on port 3000")
});