const axios = require("axios");

const fetchFrom = "https://studynotion-backend-auo1.onrender.com/api/v1/course/showAllCategories";
const sendTo = "http://localhost:4000/api/v1/course/createCategory";

const token = process.env.SYNC_CATEGORIES_TOKEN

const copyCategories = async () => {
  if (!token) {
    throw new Error("SYNC_CATEGORIES_TOKEN is not configured");
  }

  try {
    // Step 1: Fetch categories from hosted backend
    const response = await axios.get(fetchFrom);
    const categories = response.data.data;

    console.log(` Found ${categories.length} categories to copy`);
   

    // Step 2: Send each category to your local API
    for (let category of categories) {
      try {
         console.log(category.name);
        await axios.post(sendTo, {
          name: category.name,
          description: category.description,
        },{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        console.log(`  Created: ${category.name}`);
      } catch (err) {
        console.error(` Failed to create: ${category.name} - ${err.message}`);
        //console.log(err)
      }
    }

    console.log(" All done!");
  } catch (error) {
    console.error(" Error fetching categories:", error.message);
  }
};

copyCategories();
