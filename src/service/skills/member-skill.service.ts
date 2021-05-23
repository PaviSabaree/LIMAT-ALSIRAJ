import { IMemberSkills } from "../../interfaces/i-member-skills";
import { MemberSkillSetSchema } from "../../schema/skill/member-skill.schema";

class MemberSkillService {

    public async addMemberSkillSet(skillSetObj: IMemberSkills):Promise<any> {
        try {
            const skillSet = new MemberSkillSetSchema({
                UserName: skillSetObj.UserName,
                UserId: skillSetObj.UserId,
                Skills: skillSetObj.Skills,
                Exp: skillSetObj.Exp,
                EmailId: skillSetObj.EmailId,
            });

            return await skillSet.save();
        }catch(err){
            console.debug("Error occured in addMemberSkillSet");
            throw err;
        }
    }

    public async getMemberSkillList(userId: string):Promise<any> {
        try {

            return await  MemberSkillSetSchema.find({'UserId': userId}).exec()
        }catch(err){
            console.debug("Error occured in getMemberSkillList");
            throw err;
        }
    }

    public async editMemberSkillSet(skillSetObj: IMemberSkills):Promise<any> {
        try {

            return await MemberSkillSetSchema.updateOne(
                    {UserId: skillSetObj.UserId},
                    {
                        $set: {
                            Skills: skillSetObj.Skills,
                            Exp: skillSetObj.Exp,  
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
            
            return await MemberSkillSetSchema.deleteOne({"_id" : skillSetId }).exec();
        }catch(err){
            console.debug("Error occured in deleteMemberSkillSet");
            throw err;
        }
    }

}
export default MemberSkillService;