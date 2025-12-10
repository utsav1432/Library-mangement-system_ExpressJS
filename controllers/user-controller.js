const {UserModel, BookModel} = require("../models");

exports.getAllUser = async (req, res) => {
    const users = await UserModel.find();

    if (!users || users.length === 0){
        return res.status(404).json({
            success: false,
            message: "No Users Found"
        })
    }

    res.status(200).json({
        success: true,
        data: users
    })
}

exports.getSingleUserById = async (req, res) => {
    const {id} = req.params;

    const user = await UserModel.findById(id)

    if (!user){
        return res.status(404).json({
            success: false,
            message: `No User Found on id ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
}

exports.createUser = async (req, res) => {
    const {data} = req.body;

    if (!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to create a new user"
        })
    }

    await UserModel.create(data);
    const getAllUser = await UserModel.find();

    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: getAllUser
    })
}

exports.updateUserById = async (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to update the user"
        })
    }

    const user = await UserModel.findById(id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found for id ${id}`
        })
    }

    const updateUser = await UserModel.findByIdAndUpdate(id, data, {new: true, runValidators: true });

    res.status(200).json({
        success: true,
        data: updateUser,
        message: "User Updated Successfully"
    })
}

exports.deleteUserById = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id)

    if (!user){
        return res.status(404).json({
            success: false,
            message: `No User Found on id ${id}`
        })
    }

    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
}



// exports.getSubscriptionDetailsById = async (req, res) => {
//     const {id} = req.params;

//     const user = await UserModel.findById(id);
//     if (!user){
//         return res.status(404).json({
//             success: false,
//             message: `User Not Found for id: ${id}`
//         })
//     }

//     const getDateInDays = (dateString = '') => {
//         let date;
//         if(dateString && dateString !== ''){
//             date = new Date(dateString);
//         } else {
//             date = new Date();
//         }
//         return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
//     }

//     const subscriptionType = (date) => {
//         if (user.subscriptionType === "Basic"){
//             date = date + 90;
//         } else if (user.subscriptionType === "Standard"){
//             date = date + 180;
//         } else if (user.subscriptionType === "Premium"){
//             date = date + 365;
//         }
//         return date;
//     }

//     const returnDateInDays = getDateInDays(user.returnDate);
//     const currentDateInDays = getDateInDays();
//     const subscriptionDateInDays = getDateInDays(user.subscriptionDate);
//     const subscriptionExpirationInDays = subscriptionType(subscriptionDateInDays);

//     const daysLeftForReturn = returnDateInDays > currentDateInDays ? returnDateInDays - currentDateInDays : 0;
//     const isBookOverdue = returnDateInDays < currentDateInDays;
//     const isSubscriptionExpired = subscriptionExpirationInDays < currentDateInDays;
//     const subscriptionDaysLeft = subscriptionExpirationInDays > currentDateInDays ? subscriptionExpirationInDays - currentDateInDays : 0;

//     let fine = 0;
//     if (isBookOverdue) {
//         fine = isSubscriptionExpired ? 200 : 100;
//     }

//     const data = {
//         ...user._doc,
//         subscriptionExpired: isSubscriptionExpired,
//         subscriptionDaysLeft: subscriptionDaysLeft,
//         daysLeftForReturn: daysLeftForReturn,
//         returnStatus: isBookOverdue ? "Book is overdue" : "On time",
//         fine: fine,
//         subscriptionExpirationDate: new Date(subscriptionExpirationInDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//     }

//     res.status(200).json({
//         success: true,
//         data: data
//     })
// }
exports.getSubscriptionDetailsById = async (req, res) => {
    const {id} = req.params;

    const user = await UserModel.findById(id);
    if (!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found for id: ${id}`
        })
    }

    const getDateInDays = (dateString = '') => {
        let date;
        if(dateString && dateString !== '' && dateString !== null){
            date = new Date(dateString);
        } else {
            date = new Date();
        }
        // Handle invalid dates
        if (isNaN(date.getTime())) {
            return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
        }
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    }

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic"){
            return date + 90;
        } else if (user.subscriptionType === "Standard"){
            return date + 180;
        } else if (user.subscriptionType === "Premium"){
            return date + 365;
        }
        return date; // Return default if no subscription type
    }

    // Get dates in days
    const returnDateInDays = getDateInDays(user.returnDate);
    const currentDateInDays = getDateInDays();
    const subscriptionDateInDays = getDateInDays(user.subscriptionDate);
    const subscriptionExpirationInDays = subscriptionType(subscriptionDateInDays);

    // Calculate days differences
    const daysLeftForReturn = returnDateInDays > currentDateInDays ? returnDateInDays - currentDateInDays : 0;
    const isBookOverdue = returnDateInDays < currentDateInDays;
    const isSubscriptionExpired = subscriptionExpirationInDays < currentDateInDays;
    const subscriptionDaysLeft = subscriptionExpirationInDays > currentDateInDays ? subscriptionExpirationInDays - currentDateInDays : 0;

    // Calculate fine
    let fine = 0;
    if (isBookOverdue) {
        fine = isSubscriptionExpired ? 200 : 100;
    }

    // Calculate subscription expiration date safely
    let subscriptionExpirationDate = "Not available";
    try {
        // Create date from subscriptionDate and add days based on subscription type
        const subDate = user.subscriptionDate ? new Date(user.subscriptionDate) : new Date();
        if (!isNaN(subDate.getTime())) {
            let daysToAdd = 0;
            if (user.subscriptionType === "Basic") daysToAdd = 90;
            else if (user.subscriptionType === "Standard") daysToAdd = 180;
            else if (user.subscriptionType === "Premium") daysToAdd = 365;
            
            subDate.setDate(subDate.getDate() + daysToAdd);
            subscriptionExpirationDate = subDate.toISOString().split('T')[0];
        }
    } catch (error) {
        console.error("Error calculating expiration date:", error);
    }

    const data = {
        ...user._doc,
        subscriptionExpired: isSubscriptionExpired,
        subscriptionDaysLeft: subscriptionDaysLeft,
        daysLeftForReturn: daysLeftForReturn,
        returnStatus: isBookOverdue ? "Book is overdue" : "On time",
        fine: fine,
        subscriptionExpirationDate: subscriptionExpirationDate
    }

    res.status(200).json({
        success: true,
        data: data
    })
}




// const {UserModel, BookModel} = require("../models");

// exports.getAllUser = async (req, res) => {
//     const users = await UserModel.find();

//     if (!users || users.length === 0){
//         return res.status(404).json({
//             success: false,
//             message: "No Users Found"
//         })
//     }

//     res.status(200).json({
//         success: true,
//         data: users
//     })
// }

// exports.getSingleUserById = async (req, res) => {
//     const {id} = req.params;

//     // const user = await UserModel.findById(id)
//     const user = await UserModel.findById({_id:id})
//     // const user = await UserModel.findByone({_id:id});

//     if (!user){
//         return res.status(404).json({
//             success: false,
//             message: `No User Found on id ${id}`
//         })
//     }
//     res.status(200).json({
//         success: true,
//         data: user
//     })
// }

// exports.createUser = async (req, res) => {
//     const {data} = req.body;

//     if (!data || Object.keys(data).length === 0){
//         return res.status(400).json({
//             success: false,
//             message: "Please provide the data to create a new user"
//         })
//     }

//     await UserModel.create(data);
//     const getAllUser = await UserModel.find();

//     res.status(201).json({
//         success: true,
//         message: "User Create Successfully",
//         data: getAllUser
//     })
// }

// exports.updateUserById = async (req, res) => {
//     const {id} = req.params;
//     const {data} = req.body;

//     if(!data || Object.keys(data).length === 0){
//         return res.status(400).json({
//             success: false,
//             message: "Please provide the data to update the user"
//         })
//     }

//     const user = await UserModel.findById(id)
//     if(!user){
//         return res.status(404).json({
//             success: false,
//             message: `User Not Found for id ${id}`
//         })
//     }

//     const updateUser = await UserModel.findByIdAndUpdate(id, data, {new: true, runValidators: true });

//     res.status(200).json({
//         success: true,
//         data: updateUser,
//         message: "User Updated Successfully"
//     })
// }

// exports.deleteUserById = async (req, res) => {
//     const { id } = req.params;

//     const user = await UserModel.findById(id)

//     if (!user){
//         return res.status(404).json({
//             success: false,
//             message: `No User Found on id ${id}`
//         })
//     }

//     await UserModel.findByIdAndDelete(id);

//     res.status(200).json({
//         success: true,
//         message: "User Deleted Successfully"
//     })
// }

// exports.getSubscriptionDetailsById = async (req, res) => {
//     const {id} = req.params;

//     const user = await UserModel.findById(id);
//     if (!user){
//         return res.status(404).json({
//             success: false,
//             message: `User Not Found for id: ${id}`
//         })
//     }

//     const getDateInDays = (data = '') => {
//         let date;
//         if(!data){
//             date = new Date (data);
//         } else{
//             date = new Date ();
//         }
//         let days = Math.floor(date / (1000 * 60 * 60 * 24));
//         return days
//     }

//     const subscriptionType = (date) => {
//         if (user.subscriptionType === "Basic"){
//             date = date + 90
//         } else if (user.subscriptionType === "Standard"){
//             date = date + 180
//         } else if (user.subscriptionType === "Standard"){
//             date = date + 365
//         }
//         return date;
//     }

//     let returnDate = getDateInDays(user.returnDate);
//     let currentDate = getDateInDays();
//     let subscriptionDate = getDateInDays(user.subscriptionDate);
//     let subscriptionExpiration = subscriptionType(subscriptionDate);

//     const data = {
//         ...user._doc,
//         subscriptionExpired: subscriptionExpiration < currentDate,
//         subscriptionDaysLeft: subscriptionExpiration - currentDate,
//         daysLeftForExpiration: returnDate- currentDate,
//         returnDate: returnDate < currentDate ? "Book is overdue" : returnDate,
//         fine: returnDate < currentDate ? subscriptionExpiration <- currentDate ? 200 : 100 : 0
//     }

//     res.status(200).json({
//         success: true,
//         data
//     })
// }