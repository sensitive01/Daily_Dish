const xlsx = require("xlsx");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

// MongoDB connection URI
const uri = "mongodb+srv://techsensitivecoin:oWLAvSZT5yJM1cyh@cluster0.w2god.mongodb.net/daiy_dish";

// MongoDB client
const client = new MongoClient(uri);

async function uploadExcelToMongoDB() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("✅ Connected to MongoDB successfully!");

        // Access database and collection
        const database = client.db("daiy_dish");
        const collection = database.collection("Foodorder");

        // Read Excel file
        const filePath = "./Corporatebookings_(2)(1).xlsx";

        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON
            const data = xlsx.utils.sheet_to_json(sheet);
            if (!data || data.length === 0) {
                throw new Error("❌ No data found in Excel file");
            }

            console.log(`📊 Parsed ${data.length} rows from Excel file`);

            // Process data before insertion
            const processedData = data.map(record => {
                let processedRecord = {
                    ...record,
                    uploadedAt: new Date(),
                    lastModified: new Date()
                };

                // Convert _id to ObjectId if it exists
                if (record._id) {
                    try {
                        processedRecord._id = new ObjectId(record._id);
                    } catch (e) {
                        console.warn(`⚠️ Invalid ObjectId format for record: ${record._id}`);
                    }
                }

                // Convert createdAt to Date format if it exists
                if (record.createdAt) {
                    processedRecord.createdAt = new Date(record.createdAt);
                }

                return processedRecord;
            });

            console.log("🚀 Processing data for insertion...");

            // Insert or update data (Upsert method)
            let upsertCount = 0;
            for (const record of processedData) {
                const result = await collection.updateOne(
                    { _id: record._id || new ObjectId() }, // Use provided _id or generate a new one
                    { $set: record },
                    { upsert: true }
                );

                if (result.upsertedCount > 0) {
                    upsertCount++;
                }
            }

            console.log(`✅ Successfully inserted/updated ${upsertCount} records`);

            // Log final count
            const finalCount = await collection.countDocuments();
            console.log(`📦 Total records in MongoDB after operation: ${finalCount}`);

        } catch (fileError) {
            console.error("❌ Error processing Excel file:", fileError.message);
            throw fileError;
        }

    } catch (error) {
        console.error("❌ Error in upload process:", error.message);
        throw error;

    } finally {
        try {
            await client.close();
            console.log("🔒 MongoDB connection closed successfully");
        } catch (closeError) {
            console.error("⚠️ Error closing MongoDB connection:", closeError.message);
        }
    }
}

// Execute the function
uploadExcelToMongoDB()
    .catch(error => {
        console.error("❌ Failed to complete upload process:", error.message);
        process.exit(1);
    });
