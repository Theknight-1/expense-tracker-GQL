import Transaction from "../../models/transaction.model";

const transactionResover = {
  Query: {
    transactions: async (_, _, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("User is unauthorized");
        }
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId: userId });
        return transactions;
      } catch (err) {
        console.log("Error getting transactions:", err);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.log("Error getting transaction:", err);
        throw new Error("Error getting transaction");
      }
    },
    // Todo => Add category statistics query
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const { description, paymentType, category, amount, location, date } =
          input;
        if (
          !description ||
          !paymentType ||
          !category ||
          !amount ||
          !location ||
          !date
        ) {
          throw new Error("some fields are required.");
        }
        const newTransaction = new Transaction({
          userId: context.getUser()._id,
          desciption: description,
          paymentTypes: paymentType,
          category: category,
          ammount: amount,
          locaton: location,
          date: date,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.log("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.log("Error updateing transaction:", err);
        throw new Error("Error updateing transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return updatedTransaction;
      } catch (error) {
        console.log("Error Deleting transaction:", err);
        throw new Error("Error Deleting transaction");
      }
    },
  },
};

export default transactionResover;
