import clientModel from "../../models/client.model.js";
import { StatusCodes } from "http-status-codes";

export const editClient = async (req, res) => {
  const { firstName, lastName, address, city, state, phone, description } =
    req.body;

  const { clientId } = req.params;

  try {
    const client = await clientModel.findById(clientId);
    if (!client) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Client not found" });
    }

    let dataToChange = {
      firstName: firstName || client.firstName,
      lastName: lastName || client.lastName,
      address: address || client.address,
      city: city || client.city,
      state: state || client.state,
      phone: phone || client.phone,
      description: description || client.description,
    };

    await clientModel.findByIdAndUpdate(
      clientId,
      { $set: dataToChange },
      { new: true }
    );
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Info updated successfully" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getAllFullClients = async (req, res) => {
  try {
    const clients = await clientModel.find({}).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account has been activated",
      clients,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
