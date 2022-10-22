const { Router } = require("express");
const axios = require("axios");
const { Videogame, Genre } = require("../db");
const router = Router();
const { API_KEY } = process.env;
const json = require("../harcode.json");
const { Op } =require ("sequelize");
//Post

const videogamePost = async (req, res) => {
  try {
    const {
      name,
      background_image,
      rating_api,
      rating_user,
      description,
      released,
      price,
      images,
      requirements,
      genres,
      stock,
    } = req.body;
    const newVideogame = await Videogame.create({
      name,
      background_image,
      rating_api,
      rating_user,
      description,
      released,
      price,
      images,
      requirements,
      stock,
    });

    let genresDb = await Genre.findAll({
      where: { name: genres },
    });
    newVideogame.addGenres(genresDb);

    res.status(200).json(newVideogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getGamesDb = async (req, res) => {
  try {
    let games = await Videogame.findAll({
      where: {
        stock: { [Op.lt]: 0 },
      },
      include: {
        model: Genre,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    return games;
  } catch (error) {
    console.log(error);
  }
};

const getAllGames = async (req, res) => {
  const {page = 0, size =10} = req.query;
  let options={
    limit: +size,
    offset: (+page) * (+size)
  }
  const { count, rows} = await Videogame.findAndCountAll(options)
  let { name } = req.query;
  try {
    let games = await getGamesDb()
    if (name) {
      let found = await Videogame.findAll({
        where: { name: name },
        include: {
          model: Genre,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },

      });
      if (found) {
        return res.status(200).json(found);
      } else {
        return res
          .status(404)
          .send({ msg: "sorry, this game is not available now" });
      }
    } else {
      res.json({
        status: 'success',
        total: count,
        games: rows,
      })
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const videogameByID = async (req, res) => {
  const { id } = req.params;

  try {
    const videoGameDb = await Videogame.findOne({
      where: { id: id },

      include: {
        model: Genre,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    res.json(videoGameDb);
  } catch (error) {
    res.send(error);
  }
};

const getGenres = async (req, res) => {
  try {
    const data = await Genre.findAll();
    res.send(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getDiscounts = async(req, res) => {
  try {
    const discounts = await Videogame.findAll({
      where: {
        "discount.status" : true
      }
    })

    if(!discounts.length) {
      return res.send("Don't exist any discount")
    }
    res.json(discounts)
  } catch (error) {
    res.status(404).send(error.message)
  }
}

const updateVideogame = async (req, res) => {
  let { id } = req.params;
  let {
    name,
    background_image,
    rating_api,
    rating_user,
    description,
    released,
    price,
    images,
    requirements,
  } = req.body;

  try {
    let find = await Videogame.findOne({ where: { id: id } });
    if (find) {
      await Videogame.update(
        {
          name: name ? name : find.name,
          background_image: background_image
            ? background_image
            : find.background_image,
          rating_api: rating_api ? rating_api : find.rating_api,
          rating_user: rating_user ? rating_user : find.rating_user,
          description: description ? description : find.description,
          released: released ? released : find.released,
          price: price ? price : find.price,
          images: images ? images : find.images,
          requirements: requirements ? requirements : find.requirements,
        },
        { where: { id: id } }
      );
      return res.send({ msg: "Updated successfully" });
    }
    res.send({ msg: "Videogame doesn't exist" });
  } catch (error) {
    res.status.send(error);
  }
};

module.exports = {
  videogamePost,
  videogameByID,
  getGenres,
  updateVideogame,
  getAllGames,
  getDiscounts
};
