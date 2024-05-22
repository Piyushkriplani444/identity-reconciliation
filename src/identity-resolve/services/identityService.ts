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
                            email: email || null
                        },
                        {
                            phoneNumber: phoneNumber || null
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
            } else {
                const primary_ids = [];
                const secondaryLinkedIds = [];
                console.log('pkpkpk');
                for (let i = 0; i < data.length; i++) {
                    if (data[i]?.linkPrecedence == 'primary') {
                        primary_ids.push(data[i]?.id);
                    } else {
                        secondaryLinkedIds.push(data[i]?.linkedId);
                    }
                }

                if (primary_ids.length == 0) {
                    const primaryIDS = [...new Set(secondaryLinkedIds)];
                    if (primaryIDS.length == 1) {
                        return this.SingleCount(primaryIDS, email, phoneNumber);
                    } else if (primaryIDS.length > 1) {
                        const primarydata = Math.min(...primaryIDS);
                        const secondarydata = Math.max(...primaryIDS);

                        await Contacts.update(
                            {
                                linkedId: primarydata,
                                linkPrecedence: 'secondary',
                                updatedAt: new Date()
                            },
                            {
                                where: {
                                    id: secondarydata
                                }
                            }
                        );

                        await Contacts.update(
                            {
                                linkedId: primarydata,
                                updatedAt: new Date()
                            },
                            {
                                where: {
                                    linkedId: secondarydata
                                }
                            }
                        );
                        await Contacts.create({
                            email: email || null,
                            phoneNumber: phoneNumber || null,
                            linkedId: primarydata,
                            linkPrecedence: 'secondary'
                        });

                        const linked_data = await Contacts.findAll({
                            where: {
                                [Op.or]: [
                                    {
                                        id: primarydata
                                    },
                                    {
                                        linkedId: primarydata
                                    }
                                ]
                            }
                        });

                        return this.formatData(linked_data);
                    }
                } else if (primary_ids.length == 1) {
                    const p = [...new Set([...primary_ids, ...secondaryLinkedIds])];
                    if (p.length == 1) {
                        return this.SingleCount(p, email, phoneNumber);
                    } else if (p.length > 1) {
                        return this.DoubleCount(p, email, phoneNumber);
                    }
                } else if (primary_ids.length > 1) {
                    return this.DoubleCount(primary_ids, email, phoneNumber);
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async DoubleCount(data: number[], email?: string, phoneNumber?: string) {
        try {
            const primarydata = Math.min(...data);
            const secondarydata = Math.max(...data);

            await Contacts.update(
                {
                    linkedId: primarydata,
                    linkPrecedence: 'secondary',
                    updatedAt: new Date()
                },
                {
                    where: {
                        id: secondarydata
                    }
                }
            );
            await Contacts.update(
                {
                    linkedId: primarydata,
                    updatedAt: new Date()
                },
                {
                    where: {
                        linkedId: secondarydata
                    }
                }
            );
            await Contacts.create({
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkedId: primarydata,
                linkPrecedence: 'secondary'
            });

            const linked_data = await Contacts.findAll({
                where: {
                    [Op.or]: [
                        {
                            id: primarydata
                        },
                        {
                            linkedId: primarydata
                        }
                    ]
                }
            });

            return this.formatData(linked_data);
        } catch (error) {
            throw error;
        }
    }

    static async SingleCount(data: Number[], email?: string, phoneNumber?: string) {
        try {
            const id = data[0];
            await Contacts.create({
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkedId: id,
                linkPrecedence: 'secondary'
            });

            const linked_data = await Contacts.findAll({
                where: {
                    [Op.or]: [
                        {
                            id: id
                        },
                        {
                            linkedId: id
                        }
                    ]
                }
            });

            return this.formatData(linked_data);
        } catch (error) {
            throw error;
        }
    }

    static formatData(datas: any) {
        try {
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
                    emails: [...new Set(em)],
                    phoneNumbers: [...new Set(pN)],
                    secondaryContactIds: [...new Set(sc)]
                }
            };
        } catch (error) {
            throw error;
        }
    }
};
