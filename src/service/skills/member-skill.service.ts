import { IMemberSkills } from "../../interfaces/i-member-skills";
import { MemberSkillSetSchema } from "../../schema/skill/member-skill.schema";

class MemberSkillService {

    public async addMemberSkillSet(skillSetObj: IMemberSkills):Promise<any> {
        try {
            const skillSet = new MemberSkillSetSchema({
                userName: skillSetObj.userName,
                userId: skillSetObj.userId,
                skills: skillSetObj.skills,
                exp: skillSetObj.exp,
                emailId: skillSetObj.emailId,
            });

            return await skillSet.save();
        }catch(err){
            console.debug("Error occured in addMemberSkillSet");
            throw err;
        }
    }

    public async getMemberSkillList(userId: string, userInfo):Promise<any> {
        try {

           if(userId){
               // authenticate user details             
                return await  MemberSkillSetSchema.find({'userId': userId}).exec()

           }else{
               // authenticate admin user to gibe all users skills

               if(userInfo.userType === 'admin'){
                return await  MemberSkillSetSchema.find().exec()
               }
           }

            
        }catch(err){
            console.debug("Error occured in getMemberSkillList");
            throw err;
        }
    }

    public async editMemberSkillSet(skillSetObj: IMemberSkills, skillId: string):Promise<any> {
        try {

            return await MemberSkillSetSchema.findOneAndUpdate(
                    {'_id': skillId},
                    {
                        $set: {
                            'skills': skillSetObj.skills,
                            'exp': skillSetObj.exp,  
                        }
                    }
                ).exec();        
            
        }catch(err){
            console.debug("Error occured in editMemberSkillSet");
            throw err;
        }
    }

    public async deleteMemberSkillSet(skillSetId: string):Promise<any> {
        try {
            
            return await MemberSkillSetSchema.findOneAndDelete({"_id" : skillSetId }).exec();
        }catch(err){
            console.debug("Error occured in deleteMemberSkillSet");
            throw err;
        }
    }

}
export default MemberSkillService;