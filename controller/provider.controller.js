import { userModel } from "../model/user.model.js";

export const getProviderWithRange = async (req, res) => {
  try {
    const { latitude, longitude, rangeKm, providerType } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    const maxDistance = Number(rangeKm) || 5; // default 5 km
    const secondsPer100m = 30; // 100 meters = 30 seconds

    const providers = await userModel.aggregate([
      { $match: { role: "provider", ...(providerType && { providerType }) } },

      // Calculate distance in KM
      {
        $addFields: {
          distance: {
            $multiply: [
              6371, // Earth radius in KM
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $degreesToRadians: "$lattitude" } },
                        { $sin: { $degreesToRadians: Number(latitude) } }
                      ]
                    },
                    {
                      $multiply: [
                        { $cos: { $degreesToRadians: "$lattitude" } },
                        { $cos: { $degreesToRadians: Number(latitude) } },
                        {
                          $cos: {
                            $subtract: [
                              { $degreesToRadians: "$longitude" },
                              { $degreesToRadians: Number(longitude) }
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        }
      },

      // Filter providers within the maxDistance
      { $match: { distance: { $lte: maxDistance } } },

      // Sort by nearest first
      { $sort: { distance: 1 } },

      // Format output and calculate precise estimated time
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          city: 1,
          state: 1,
          country: 1,
          providerType: 1,
          lattitude: 1,
          longitude: 1,
          distance: {
            $concat: [
              { $toString: { $round: ["$distance", 2] } },
              "Km"
            ]
          },
          estimatedTime: {
            $concat: [
              // minutes
              { $toString: { $floor: { $multiply: ["$distance", 5] } } },
              " min ",
              // seconds
              { 
                $toString: { 
                  $floor: { $multiply: [ { $mod: [ { $multiply: ["$distance", 5] }, 1 ] }, 60 ] } 
                } 
              },
              " sec"
            ]
          }
        }
      }
    ]);

    res.status(200).json({
      count: providers.length,
      providers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching providers", err });
  }
};
