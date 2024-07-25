// Check if user is subscribed
// app.get("/check-subscription/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Find active subscriptions for the user
//     const activeSubscriptions = await UserSubscription.find({
//       userId,
//       isActive: true,
//       endDate: { $gt: new Date() }, // Ensure the subscription is still valid
//     });

//     if (activeSubscriptions.length > 0) {
//       res.status(200).send({ isSubscribed: true });
//     } else {
//       res.status(200).send({ isSubscribed: false });
//     }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

app.get("/user/:userId/properties/available", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's property subscription updates with updateFor 'available'
    const subscriptions = await PropertiesSubscriptionUpdate.find({
      userId,
      updateFor: "available",
    });

    const properties = [];
    for (const subscription of subscriptions) {
      const query = {
        isAvailable: true,
        ...(subscription.state && { state: subscription.state }),
        ...(subscription.city && { city: subscription.city }),
        ...(subscription.category && { category: subscription.category }),
        $and: [
          { price: { $gte: subscription.minPrice || 0 } },
          { price: { $lte: subscription.maxPrice || Infinity } },
        ],
      };

      const matchingProperties = await Property.find(query);
      properties.push(...matchingProperties);
    }

    res.status(200).send(properties);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get("/user/:userId/properties/weekly-created", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's property subscription updates with updateFor 'market'
    const subscriptions = await PropertiesSubscriptionUpdate.find({
      userId,
      updateFor: "market",
    });

    if (subscriptions.length === 0) {
      return res.status(200).send([]);
    }

    // Get all weekly created property IDs
    const weeklyCreatedProperties = await WeeklyCreatedProperty.find({});
    const propertyIds = weeklyCreatedProperties.map((item) => item.propertyId);

    const properties = [];
    for (const subscription of subscriptions) {
      const query = {
        _id: { $in: propertyIds },
        ...(subscription.state && { state: subscription.state }),
        ...(subscription.city && { city: subscription.city }),
        ...(subscription.category && { category: subscription.category }),
        $and: [
          { price: { $gte: subscription.minPrice || 0 } },
          { price: { $lte: subscription.maxPrice || Infinity } },
        ],
      };

      const matchingProperties = await Property.find(query);
      properties.push(...matchingProperties);
    }

    res.status(200).send(properties);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
