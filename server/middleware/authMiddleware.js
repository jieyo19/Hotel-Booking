import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next)=>{
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId;
        if(!userId){
            return res.status(401).json({success: false, message: "Not authenticated"});
        }
        
        let user = await User.findById(userId);
        
        // If user doesn't exist, create one from Clerk data
        if (!user) {
            try {
                // Try to get user info from Clerk - this might not always be available
                // So we'll create a minimal user
                user = await User.create({
                    _id: userId,
                    username: `User_${userId.substring(0, 8)}`,
                    email: `${userId}@temp.com`,
                    image: '',
                    role: 'user'
                });
                console.log('Created user in database:', userId);
            } catch (createError) {
                // If user already exists (race condition), fetch it
                if (createError.code === 11000) {
                    user = await User.findById(userId);
                } else {
                    console.error('Error creating user:', createError);
                    // Create a minimal user object to allow the request
                    user = { 
                        _id: userId,
                        username: `User_${userId.substring(0, 8)}`,
                        email: `${userId}@temp.com`
                    };
                }
            }
        }
        
        if (!user || !user._id) {
            return res.status(401).json({success: false, message: "User not found"});
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protect middleware:', error);
        return res.status(500).json({success: false, message: "Authentication error"});
    }
}