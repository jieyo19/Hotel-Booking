// GET /api/user/

export const getUserData = async (req, res)=>{
    try {
        const role = req.user.role;
        const recentsSearchedCities = req.user.recentsSearchedCities;
        res.json({success: true, role, recentsSearchedCities})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res)=>{
    try {
        const {recentsSearchedCity} = req.body;
        const user = await req.user;

        if(user.recentsSearchedCities.length < 3){
            user.recentsSearchedCities.push(recentsSearchedCity)
        }else{
            user.recentsSearchedCities.shift();
            user.recentsSearchedCities.push(recentsSearchedCity)
        }
        await user.save();
        res.json({success: true, message: "City added"})

    } catch (error) {
        res.json({success: false, message: error.message })
    }
};