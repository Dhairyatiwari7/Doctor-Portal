import Doctor from '../models/doctorModel.js'

const changeAvailability=async(req,res)=>{
    try {
        const {docId}=req.body
        const docData=await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId,{available:!docData.available})
        return res.status(200).json({success:true , message:"Availability changed successfully"})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const getAllAvailableDoctors=async(req,res)=>{
    try {
        const availableDocData=await Doctor.find({available:true}).select("-password -email")
        return res.status(200).json({success:true , data:availableDocData})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export {changeAvailability,getAllAvailableDoctors}