const Sequelize = require("sequelize")
const sequelize = new sequelize('cte', 'root', ''{
  host: 'localhost',
  dialect: 'mysql'
})

module.exports= {
  Sequelize: Sequelize,
  sequelize: sequelize
}