import {Credit} from "../model/credit.model.js";

export const addCredits  = (req,res) =>{
  const { userId, amount, description } = req.body;

  const newCredit = new Credit({
    userId,
    amount,
    description
  });

  newCredit.save()
    .then(() => {
      res.status(201).json({
        message: "Credits added successfully",
        credit: newCredit
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding credits",
        error: error.message
      });
    });
}
