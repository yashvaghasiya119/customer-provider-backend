
import { userModel } from "../model/user.model.js";
import timingData from "../timing.json" assert { type: "json" };


export const findProvider = async (req, res) => {
  try {
    const { latitude, longitude, rangeKm, providerType } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    // Fetch city from coordinates
    const cityFetch = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
    const cityData = await cityFetch.json();
    const city = cityData.address.city || cityData.address.town || cityData.address.village || cityData.address.state_district || "Unknown";

    const cityTiming = timingData.find(c => c.city.toLowerCase() === city.toLowerCase());
    const secondsPer100m = cityTiming ? cityTiming.timing : 30; // default 30 sec if city not found

    const maxDistance = Number(rangeKm) || 5; // default 5 km

    const providers = await userModel.aggregate([
      { $match: { role: "provider", ...(providerType && { providerType }) } },

      // Calculate distance in KM using Haversine formula
      {
        $addFields: {
          distance: {
            $multiply: [
              6371, // Earth's radius in km
              {
                $acos: {
                  $add: [
                    { $multiply: [ { $sin: { $degreesToRadians: "$lattitude" } }, { $sin: { $degreesToRadians: Number(latitude) } } ] },
                    { $multiply: [ { $cos: { $degreesToRadians: "$lattitude" } }, { $cos: { $degreesToRadians: Number(latitude) } }, { $cos: { $subtract: [ { $degreesToRadians: "$longitude" }, { $degreesToRadians: Number(longitude) } ] } } ] }
                  ]
                }
              }
            ]
          }
        }
      },

      // Filter providers within maxDistance
      { $match: { distance: { $lte: maxDistance } } },

      // Sort by nearest
      { $sort: { distance: 1 } },

      // Format output with dynamic estimated time
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
          distance: { $concat: [ { $toString: { $round: ["$distance", 2] } }, " Km" ] },

          // Dynamic estimated time using city timing
          estimatedTime: {
            $concat: [
              // minutes
              { 
                $toString: { 
                  $floor: { $multiply: ["$distance", 1000 / 100 * (secondsPer100m / 60)] } 
                } 
              },
              " min ",
              // seconds
              { 
                $toString: { 
                  $floor: { $mod: [ { $multiply: ["$distance", 1000 / 100 * secondsPer100m] }, 60 ] } 
                } 
              },
              " sec"
            ]
          }
        }
      }
    ]);

    res.status(200).json({
      city,
      count: providers.length,
      providers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching providers", err });
  }
};
