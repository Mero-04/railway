const express = require("express");
const router = express.Router();
const { Worker, Contact, User, Category } = require("../models/model")
const multer = require("multer");
const imageUpload = require("../helpers/image-upload");
const multiUpload = require("../helpers/multi-upload")
const upload = multer({ dest: 'uploads/' })
const bcrypt = require("bcrypt")
const fs = require("fs")
const isKadr = require("../middlewares/isKadr");


router.get("/", isKadr, async (req, res) => {
    const categories = await Category.findAll()
    res.render("kadr/home_kadr", {
        categories: categories,
        img: req.session.img,
        username: req.session.email,
        page: "home"
    })
})


router.get("/contact", isKadr, async (req, res) => {
    const contacts = await Contact.findAll();
    res.render("kadr/contact", {
        contact: contacts,
        img: req.session.img,
        username: req.session.email,
        page : "contact"
    })
});


router.get("/users", isKadr, async (req, res) => {
    const blogs = await User.findAll({
        include: { model: Category }
    });
    res.render("kadr/users", {
        bloglar: blogs,
        img: req.session.img,
        username: req.session.email,
        page: "users"
    })
})

router.get("/user-add", isKadr, async (req, res) => {
    const categories = await Category.findAll();
    res.render("kadr/user-add", {
        categories: categories
    })
})

router.post("/user-add", isKadr, multiUpload.upload, async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            ata_name: req.body.ata_name,
            birth: req.body.birth,
            duty: req.body.duty,
            address: req.body.address,
            tel_nom: req.body.tel_nom,
            user_img: req.files.user_img[0].filename,
            arka_file: req.files.arka_file[0].filename,
            categoryId: req.body.categoryId
        })
        res.redirect("/kadr/users");
    } catch (err) {
        console.log(err)
    }
})

router.get("/user/:userId", async (req, res) => {
    const id = req.params.userId;
    const user = await User.findByPk(id)
    res.render("kadr/user-single", {
        user: user
    })
})

router.post("/user/edit/:userId", multiUpload.upload, async (req, res) => {
    let img = req.body.user_img;
    let file = req.body.arka_file;
    if (req.files.user_img && req.files.arka_file) {
        img = req.files.user_img[0].filename,
        file = req.files.arka_file[0].filename,

        fs.unlink("./public/uploads/user/" + req.body.user_img, err => {
            console.log(err);
        })
        fs.unlink("./public/uploads/3arka/" + req.body.arka_file, err => {
            console.log(err);
        })
    } else if (req.files.user_img && !req.files.arka_file) {

        img = req.files.user_img[0].filename,

        fs.unlink("./public/uploads/user/" + req.body.user_img, err => {
            console.log(err);
        })
    }   else if (!req.files.user_img && req.files.arka_file) {
        file = req.files.arka_file[0].filename,

        fs.unlink("./public/uploads/3arka/" + req.body.arka_file, err => {
            console.log(err);
        })
    }

    const user = await User.findByPk(req.params.userId);
    if (user) {
        user.name = req.body.name,
            user.surname = req.body.surname,
            user.ata_name = req.body.ata_name,
            user.birth = req.body.birth,
            user.duty = req.body.duty,
            user.address = req.body.address,
            user.tel_nom = req.body.tel_nom,
            user.user_img = img,
            user.arka_file = file,
            user.categoryId = req.body.categoryId

        user.save()

        res.redirect("/kadr/users")
    }
})

router.get("/user/edit/:userId", async (req, res) => {
    const id = req.params.userId;
    const user = await User.findOne({
        where: { id: id }
    })
    const categories = await Category.findAll();
    res.render("kadr/user-edit", {
        user: user,
        categories: categories
    })
})

router.get("/user/delete/:userId", isKadr, async (req, res) => {
    const user = await User.findByPk(req.params.userId)
    res.render("kadr/user_delete", {
        user: user
    })
})

router.post("/user/delete/:userId", isKadr, async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (user) {
        fs.unlink("./public/uploads/user/" + user.user_img, err => { })
        user.destroy();
        return res.redirect("/kadr/users")
    } else {
        console.log("Ulanyjy tapylmady")
    }
})



router.get("/categories", isKadr, async (req, res) => {
    const category = await Category.findAll();
    res.render("kadr/category", {
        categories: category,
        img: req.session.img,
        username: req.session.email,
        page: "category"
    })
});

router.get("/categories/:categoryId", isKadr, async (req, res) => {
    const users = await User.findAll({
        include: { model: Category },
        where: { categoryId: req.params.categoryId }
    });
    res.render("kadr/users", {
        bloglar: users,
        img: req.session.img,
        username: req.session.email,
        page: "category"
    })
});



router.get("/profil", isKadr, async (req, res) => {
    const worker = await Worker.findOne({
        where: {
            id: req.session.userId
        }
    })

    res.render("kadr/profil", {
        user: worker
    })
})


router.post("/profil/edit", isKadr, imageUpload.upload.single("worker_img"), async (req, res) => {
    let img = req.body.worker_img;
    if (req.file) {
        img = req.file.filename;

        fs.unlink("./public/uploads/profil/" + req.body.worker_img, err => {
            console.log(err);
        })
    }
    const user = await Worker.findOne({
        where: {
            id: req.session.userId
        }
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    if (user) {
        user.name = req.body.name,
            user.password = hashedPassword,
            user.worker_img = img,
            user.save()

        res.redirect("/kadr/profil")
    }
})

router.get("/profil/edit", isKadr, async (req, res) => {
    const user = await Worker.findOne({
        where: { id: req.session.userId }
    })
    res.render("kadr/profil-edit", {
        user: user
    })
})

module.exports = router;