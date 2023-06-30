const Users = require('../schema/userSchema')
const passbook = require('../schema/passBookSchema')
const withdraw = require('../schema/withdrawSchema')
const tds = require('../schema/tdsSchema')

const messages = require('../message')
const mongoose = require('mongoose')

const user = async (req, res) => {
    try {
        const { sUsername, sPassword } = req.body
        const user = new Users({
            sUsername,
            sPassword,

        })
        const userSaved = await user.save()
        
        const user1 = await Users.findOne({ sUsername: sUsername })
        // console.log(user1);

        const passbookLog = {
            iUsername: user1._id,
            nTotalBalance: 0,
            nAmount: 0,
            eTransactionType: "start",
            nDepositBalanace: 0
        }
        await passbook.create([passbookLog])

        const user3 = await Users.findOne({ sUsername: sUsername })
        // console.log(user3);

        const tdsLog = {
            iUserId: user3._id,
            }
          await tds.create([tdsLog])

          const user4 = await Users.findOne({ sUsername: sUsername })
        // console.log(user3);

        const withdrawLog = {
            iUserId: user4._id,
            nAmount:0
            }
          await withdraw.create([withdrawLog])

        return res.status(messages.status.statusSuccess).json({ ...messages.messages.registeredSuccess, userSaved })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

const passbookEntry = async (req, res) => {
    try {
        const { iUsername, nAmount, eTransactionType } = req.body

        const user = await passbook.find({ iUsername: iUsername }).sort({ _id: -1 })
        // console.log(user)
        // console.log(iUsername);
        if (!user) {
            return res
                .status(messages.status.statusNotFound)
                .json(messages.messages.userNotFound)
        }
        if (eTransactionType == "win") {


            console.log(nAmount);
            const entry = new passbook({
                iUsername, nTotalBalance: user[0].nTotalBalance + nAmount, nAmount, eTransactionType, nDepositBalanace: user[0].nDepositBalanace
            })
            // console.log(user.nTotalBalance);
            const entrySaved = await entry.save()
            res.status(201).json(entrySaved)
        }
        if (eTransactionType == "deposit") {

            const entry = new passbook({
                iUsername, nTotalBalance: user[0].nTotalBalance, nAmount, eTransactionType, nDepositBalanace: user[0].nDepositBalanace + nAmount
            })
            const entrySaved = await entry.save()
            res.status(201).json(entrySaved)
        }
        if (eTransactionType == "withdraw") {

            const entry = new passbook({
                iUsername, nTotalBalance: user[0].nTotalBalance - nAmount, nAmount, eTransactionType, nDepositBalanace: user[0].nDepositBalanace
            })
            const entrySaved = await entry.save()

            const user2 = await passbook.findOne({ iUsername: iUsername })
            // console.log(user2);

            const withdrawLog = {
                iUserId: user2._id,
                nAmount,

                nDepositBalanace: 0
            }
            await withdraw.create([withdrawLog])
            res.status(201).json(entrySaved)
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
}

const tdsCount = async (req, res) => {
    try {
        const { iUserId, nAmount } = req.body
        const user = await passbook.find({ iUsername: iUserId }).sort({ _id: -1 })
        // console.log(user);

        //////////////////  find A /////////
        const PastTotalWithdrawThisMonth = await withdraw.aggregate([
            {
                $match: {
                    // eTransactionType: "withdraw",
                    dCreatedAt: { $gte: new Date('2023-06-01'), $lt: new Date('2023-06-31') }
                }
            }, { $project: { nAmount: 1, _id: 0 } },
           {$group:{_id:iUserId,Totalwithdraw:{$sum:'$nAmount'}}}
        ])
        const A= PastTotalWithdrawThisMonth[0].Totalwithdraw + nAmount
        
        console.log(A);

        //////////////////  find b /////////

        const TotalDepositThisMonth = await passbook.aggregate([
            {
                $match: {
                    eTransactionType: 'deposit',
                    dCreatedAt: {
                        $gte: new Date('2023-06-01'), $lte: new Date('2023-06-31')
                    }
                }
            },
            { $project: { nDepositBalanace: 1, _id: 0 } },
            {$group:{_id:iUserId,Totaldeposit:{$sum:'$nDepositBalanace'}}}

        ])
        const B = TotalDepositThisMonth[0].Totaldeposit
        console.log(B);

        /////////////////////// find c //////////
        const LastMonthBalance = await passbook.aggregate([
            { $match: { dCreatedAt: { $lt: new Date("2023-06-1") } } }, { $sort: { dCreatedAt: -1 } },
            { $project: { nTotalBalance: 1, _id: 0 } },
            
        ])
        const C = LastMonthBalance[0].nTotalBalance
        console.log(C);

        //////////////////  find d /////////
        const TotalTdsThisMonth = await tds.aggregate([
            {
                $match: {
                    
                    dCreatedAt: { $gte: new Date('2023-06-01'), $lt: new Date('2023-06-31') }
                }
            },
             { $project: { nAmount: 1, _id: 0 } },
             {$group:{_id:null,TotalTDS:{$sum:'$nAmount'}}}
        ])
        const D = TotalTdsThisMonth[0].TotalTDS
        console.log(D);

        const taxableAmount = A - B- C - D


        const tdsPercentage = 30
        const tdsAmount = (taxableAmount * tdsPercentage) / 100;

        
        console.log(tdsAmount, "tds amount");
        const withdrawAmount = nAmount - tdsAmount

        const tdsEntry = new tds({
            iUserId,
            nAmount,
            nOriginalAmount:withdrawAmount,
            nPercentage: tdsPercentage
        });
        console.log(tdsEntry);
       await tdsEntry.save();

       //const user1 = await Users.findOne({ _id: iUserId })

        const withdrawLog = {
            iUserId,
            nAmount
            }
            console.log(withdrawLog);
          await withdraw.create([withdrawLog])

        res.status(200).json({ message:"done" })


        // });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
}


module.exports = { user, passbookEntry, tdsCount }