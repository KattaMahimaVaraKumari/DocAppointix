import 'dotenv/config'
import mongoose from 'mongoose'
import doctorModel from '../models/doctorModel.js'

const defaultLocation = {
  line1: 'Address pending update',
  line2: '',
  city: 'Unknown',
  state: 'Unknown',
  country: 'Unknown',
  pincode: 'null',
}

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
}

const hasValidLocation = (address = {}) =>
  Boolean(address.country && address.state && address.city && address.pincode)

const verifyAndBackfillLocations = async () => {
  await connect()

  const doctors = await doctorModel.find({})
  const missing = doctors.filter((doc) => !hasValidLocation(doc.address))

  console.log(`Total doctors: ${doctors.length}`)
  console.log(`Doctors missing hierarchical location: ${missing.length}`)

  for (const doctor of missing) {
    const mergedAddress = {
      ...defaultLocation,
      ...doctor.address,
      city: doctor.address?.city || defaultLocation.city,
      state: doctor.address?.state || defaultLocation.state,
      country: doctor.address?.country || defaultLocation.country,
      pincode: doctor.address?.pincode || defaultLocation.pincode,
    }

    await doctorModel.findByIdAndUpdate(doctor._id, { address: mergedAddress })
    console.log(`Backfilled location for: ${doctor.name}`)
  }

  console.log('Location verification/backfill complete.')
  await mongoose.disconnect()
}

verifyAndBackfillLocations().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
