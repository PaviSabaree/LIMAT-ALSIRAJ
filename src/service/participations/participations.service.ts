import { IApplyEvent } from "../../interfaces/i-member-skills";
import { ILoginInfo } from "../../interfaces/IUser.interface";
import { Events } from "../../schema/events/events.schema";
import { Participations } from "../../schema/participations/participations.schema";
import EmailService from "../send.mail";
import * as fs from 'fs'
import * as path from 'path'
import { mailTemplate } from "../mailTemplate.html";

class ParticipationsService {

    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public async applyEvent(userInformation: IApplyEvent): Promise<any> {
        try {

            const checkAlreadyApplied = await this._isUserAlreadyAppliedForevent(
                userInformation.userId, userInformation.eventId)

            const eventInformation: any = await Events.findOne({'_id': userInformation.eventId}).exec()  
            
            if(eventInformation['status'].toUpperCase()!=="ACTIVE"){
                throw new Error('The Competition is not in active currently. Please apply for some other competition')
            }

            if (!checkAlreadyApplied) {
                const participants = new Participations({
                    userName: userInformation.userName,
                    userId: userInformation.userId,
                    eventId: userInformation.eventId,
                    emailId: userInformation.emailId,
                    eventName:userInformation.eventName,
                    status: 'PENDING',
                    eventInfo:userInformation.eventId
                });

                return await participants.save();
            }

            throw new Error('You Already apply for this event, Please edit or apply for new Event')


        } catch (err) {
            console.debug("Error occured in applyEvent");
            throw err;
        }
    }

    public async getParticipant(userId: string | undefined, userInfo: ILoginInfo): Promise<any> {
        try {

            if (userId) {
                return await Participations.find({ 'userId': userId }).populate('eventInfo').exec();
            } else {
                if (userInfo.userType === 'admin') {
                    return await Participations.find().populate('eventInfo').exec()
                }

                throw new Error('You are not allow to see all participant details')
            }
        } catch (err) {
            console.debug("Error occured in getParticipant");
            throw err;
        }
    }

    public async approveParticipant(participantId: string, value: string, comments: string): Promise<any> {
        try {

            const participant = await Participations.findOne({'_id':participantId})
            const mailContent = await this._getMailInformation(participantId, value, participant['emailId'],comments);

            console.log('after ==', mailContent)
            const result = await Participations.findOneAndUpdate(
                { '_id': participantId },
                {
                    $set: {
                        'status': value
                    }
                }
            ).exec();


            await this.emailService.sendMail(mailContent);

            return result

        } catch (err) {
            console.debug("Error occured in approveParticipant");
            throw err;
        }
    }
    public async deleteParticipant(participantId: string): Promise<any> {
        try {

            return await Participations.findOneAndDelete({ "_id": participantId }).exec();

        } catch (err) {
            console.debug("Error occured in approveParticipant");
            throw err;
        }
    }

    private async _isUserAlreadyAppliedForevent(userId: string, eventId: string): Promise<boolean> {
        try {

            const dbResponse = await Participations.findOne({ 'userId': userId }).exec();
            console.log('dbResponse ===', dbResponse, eventId, userId)
            if (dbResponse && dbResponse['eventId'] === eventId) {

                return true
            }

            return false
        } catch (err) {
            console.debug("Error occured in getEvents");
            throw err;
        }
    }

    private async _getMailInformation(participantId: string, value,
        toEmail: string,  comments?: string,): Promise<any> {

        return new Promise(async (resolve, reject) => {


            const getParticipantDetails = await Participations.findOne({ '_id': participantId }).exec()
            const getEventInfo = await Events.findOne({ '_id': getParticipantDetails['eventId'] }).exec()

            let greetings = ``;

            if (value.toUpperCase() === 'REJECTED') {

                greetings = `We are  very sorry that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got rejected. Please try different event`

            } else if(value.toUpperCase() === 'APPROVED'){
                greetings = `We are  pleased to announce that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got approved.`
            }
            else if(value.toUpperCase() === 'HOLD'){
                greetings = `We are  pleased to announce that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got Hold by our team. Please wait we check your information again.`
            }

            let bodyContent: string = mailTemplate

            bodyContent = bodyContent.toString().replace('user_name', getParticipantDetails['userName'] ? getParticipantDetails['userName'] : '')
                .replace('collection_name', greetings? greetings:'').replace('comments',comments? comments: '')

           resolve({
            // to: getParticipantDetails.emailId,
            to: toEmail,
            subject: getEventInfo['competitionName'],
            html: bodyContent
        })

        })


    }
}

export default ParticipationsService

