const Contact = require("../model/Contact");

const Addcontact = async (req,res) =>{
    try{

        const contact = await Contact.create(req.body);

        return res.json({
            message: "Contact added successfully",
            // fromFrontend:req.body
            contact: contact,
            status: true,
        });
    }
    catch(err){
        console.log(err);
        
        return res.json({
            message: "error while create contact",
            status: false,
            err:err
        });
    }
};

const GetContact = async (req,res) => {
    try{

        const xyz = await Contact.find()

        return res.json({
            message: "contact get success",
            contact:xyz,
            status:true
        });
    }catch(err){
        return res.json({
            message: "Error while fetch",
            status: false
        });
    }
};

const UpdateContact = async (req,res)=>{
    try{

        const updatedContact = await Contact.findByIdAndUpdate(req.params.id,req.body)
        return res.json({
            message: "lets updated succesfully",
            // id:req.params.id
            status:true,
            updatedContact
        });
    }catch(err){
        return res.json({
            message:"error while update",
            status:false
        });
    }
}

const DeleteContact = async (req,res) => {
    try{
        const deletedContact= await Contact.findByIdAndDelete(req.params.id)
        return res.json({
            message: "Deleted successfull",
            deletedContact
        });
    }catch(err){
        console.log(err);
        return res.json({
            message: "Error while delete",
            status: false
        });
    }
};

module.exports={
    Addcontact,
    GetContact,
    UpdateContact,
    DeleteContact
}