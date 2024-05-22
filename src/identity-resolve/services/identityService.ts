const Sequelize2 = require('sequelize');

const { Contacts } = require('../../models/index');
const { Op } = Sequelize2;

module.exports = class IdentityService {
    static async checkIdentity(req: Request, email?: string, phoneNumber?: string) {
        try {
            const data = await Contacts.findAll({
                where: {
                    [Op.or]: [
                        {
                            email
                        },
                        {
                            phoneNumber
                        }
                    ]
                }
            });
            if (data?.length == 0) {
                const result = await Contacts.create({
                    email: email,
                    phoneNumber: phoneNumber
                });

                return this.formatData([result]);
            }

            const id = data[0]?.id;
            await Contacts.create({
                email: email,
                phoneNumber: phoneNumber,
                linkedId: id,
                linkPrecedence: 'secondary'
            });
            return this.formatData(data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static formatData(datas: any) {
        let pc = -1;
        const em: string[] = [];
        const pN: string[] = [];
        const sc: Number[] = [];

        datas.map((data: { linkPrecedence: string; id: number; email: string; phoneNumber: string }) => {
            if (data?.linkPrecedence == 'primary') {
                pc = data?.id;
            }
            if (data?.linkPrecedence == 'secondary') {
                sc.push(data?.id);
            }
            if (data?.email) {
                em.push(data?.email);
            }
            if (data?.phoneNumber) {
                pN.push(data?.phoneNumber);
            }
        });

        return {
            contact: {
                primaryContatctId: pc,
                emails: [...em], // first element being email of primary contact
                phoneNumbers: [...pN], // first element being phoneNumber of primary contact
                secondaryContactIds: [...sc] // Array of all Contact IDs that are "secondary" to the primary contact
            }
        };
    }
};
