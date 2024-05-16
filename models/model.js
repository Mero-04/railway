const { DataTypes } = require('sequelize');
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    blog_img: { type: DataTypes.STRING, allowNull: false }
});


const Contact = sequelize.define("contact", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});


const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ata_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tel_nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_img: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Admin = sequelize.define("admin", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ADMIN"
    }
});

const Worker = sequelize.define("worker", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "WORKER"
    }
});

const Category = sequelize.define("category", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Admin.findOrCreate({ where: { email: "admin@gmail.com", password: "$2b$10$ppLSj03K./oeMqaDKYEpTehMP5/Nxp5JzmppDXbygn/ReZMhwBe5W", role: "ADMIN" } })
Worker.findOrCreate({ where: { email: "kadr@gmail.com", password: "$2b$10$ppLSj03K./oeMqaDKYEpTehMP5/Nxp5JzmppDXbygn/ReZMhwBe5W", role: "WORKER" } })

Category.hasMany(User, { onDelete: "cascade", onUpdate: "cascade" })
User.belongsTo(Category)


module.exports = {
    Blog,
    Contact,
    Admin,
    User,
    Worker,
    Category
};