import express from "express";
import cors from "cors";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, "public", "lease_doc.pdf");
const outputPath = path.join(__dirname, "public", "output.pdf");

app.use("/pdf", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send("Easy Lease Says Hello World");
});

app.post("/createForm", async (req, res) => {
  const {
    landlordName,
    tenantName,
    rentalUnit,
    contactInfo,
    leaseTermInfo,
    depositInfo,
    utilityInfo,
    landlordSignature,
    tenantSignature,
  } = req.body;
  console.log(req.body);
  async function fillForm(input, output) {
    try {
      const pdfDoc = await PDFDocument.load(await readFile(input));
      const form = pdfDoc.getForm();
      const signPage = pdfDoc.getPages()[6];

      // Names
      const txtseller1 = form.getField("txtseller1");
      const txtseller2 = form.getField("txtseller2");
      const txtseller3 = form.getField("txtseller3");
      const txtseller4 = form.getField("txtseller4");
      const txtLandlord5 = form.getField("txtLandlord5");

      txtseller1.setText(landlordName[0]?.landlordName ?? "");
      txtseller2.setText(landlordName[1]?.landlordName ?? "");
      txtseller3.setText(landlordName[2]?.landlordName ?? "");
      txtseller4.setText(landlordName[3]?.landlordName ?? "");
      txtLandlord5.setText(landlordName[4]?.landlordName ?? "");

      const txtbuyer1Lname = form.getField("txtbuyer1LName");
      const txtbuyer2Lname = form.getField("txtbuyer2LName");
      const txtbuyer3Lname = form.getField("txtbuyer3LName");
      const txtbuyer4Lname = form.getField("txtbuyer4LName");
      const txtTenant5Lname = form.getField("txtTenant5LName");

      txtbuyer1Lname.setText(tenantName[0]?.tenantLastName ?? "");
      txtbuyer2Lname.setText(tenantName[1]?.tenantLastName ?? "");
      txtbuyer3Lname.setText(tenantName[2]?.tenantLastName ?? "");
      txtbuyer4Lname.setText(tenantName[3]?.tenantLastName ?? "");
      txtTenant5Lname.setText(tenantName[4]?.tenantLastName ?? "");

      const txtbuyer1FName = form.getField("txtbuyer1FName");
      const txtbuyer2FName = form.getField("txtbuyer2FName");
      const txtbuyer3FName = form.getField("txtbuyer3FName");
      const txtbuyer4FName = form.getField("txtbuyer4FName");
      const txtTenant5FName = form.getField("txtTenant5FName");

      txtbuyer1FName.setText(tenantName[0]?.tenantFirstName ?? "");
      txtbuyer2FName.setText(tenantName[1]?.tenantFirstName ?? "");
      txtbuyer3FName.setText(tenantName[2]?.tenantFirstName ?? "");
      txtbuyer4FName.setText(tenantName[3]?.tenantFirstName ?? "");
      txtTenant5FName.setText(tenantName[4]?.tenantFirstName ?? "");

      // Property Info
      const textp_unitNumber = form.getField("txtp_unitNumber");
      textp_unitNumber.setText(rentalUnit.unit);

      const txtp_streetNum = form.getField("txtp_streetnum");
      txtp_streetNum.setText(rentalUnit.streetNumber);

      const txtp_street = form.getField("txtp_street");
      txtp_street.setText(rentalUnit.streetName);

      const txtp_city = form.getField("txtp_city");
      txtp_city.setText(rentalUnit.city);

      const txtp_zipcode = form.getField("txtp_zipcode");
      txtp_zipcode.setText(rentalUnit.postalCode);

      const txtParkingInfo = form.getField("txtParkingInfo");
      txtParkingInfo.setText(rentalUnit.parkingSpace);

      const inCondo_n = form.getCheckBox("inCondo_n");
      const inCondo_y = form.getCheckBox("inCondo_y");

      rentalUnit.inCondo === "yes" ? inCondo_y.check() : inCondo_n.check();

      // Contact Info
      const txtSellUnit = form.getField("txtSellUnit");
      txtSellUnit.setText(contactInfo.unit);

      const txtS_streetnum = form.getField("txtS_streetnum");
      txtS_streetnum.setText(contactInfo.streetNumber);

      const txtS_street = form.getField("txtS_street");
      txtS_street.setText(contactInfo.streetName);

      const txt_POBox = form.getField("txts_POBox");
      txt_POBox.setText(contactInfo.po);

      const txtS_city = form.getField("txtS_city");
      txtS_city.setText(contactInfo.city);

      const txtS_state = form.getField("txtS_state");
      txtS_state.setText(contactInfo.province);

      const txtS_zipcode = form.getField("txtS_zipcode");
      txtS_zipcode.setText(contactInfo.postalCode);

      const emailDocY = form.getCheckBox("emailDocY");
      const emailDocN = form.getCheckBox("emailDocN");

      contactInfo.emailContact === "yes"
        ? emailDocY.check()
        : emailDocN.check();

      const txtDocEmail = form.getField("txtDocEmail");
      txtDocEmail.setText(contactInfo.emailContactInfo);

      const emContY = form.getCheckBox("emContY");
      const emContN = form.getCheckBox("emContN");

      contactInfo.emergencyContact === "yes"
        ? emContY.check()
        : emContN.check();

      const txtEmergencyInfo = form.getField("txtEmergencyInfo");
      txtEmergencyInfo.setText(contactInfo.emergencyContactInfo);

      //  Lease Term Info
      const txtLeaseStartDate = form.getField("txtLeaseStartDate");
      txtLeaseStartDate.setText(leaseTermInfo.startDate);

      const fixedOpt = form.getCheckBox("fixedOpt");
      const monthOpt = form.getCheckBox("monthOpt");
      const otherOpt = form.getCheckBox("otherOpt");
      leaseTermInfo.tenancyType === "fixed"
        ? fixedOpt.check()
        : leaseTermInfo.tenancyType === "monthly"
        ? monthOpt.check()
        : leaseTermInfo.tenancyType === "other"
        ? otherOpt.check()
        : null;

      const txtLeaseEndDate = form.getField("txtLeaseEndDate");
      txtLeaseEndDate.setText(leaseTermInfo.fixedTenDate);

      const txtTenancyOther = form.getField("txtTenancyOther");
      txtTenancyOther.setText(leaseTermInfo.otherTenDetails);

      const txtRentPaidOn = form.getField("txtRentPaidOn");
      txtRentPaidOn.setText(leaseTermInfo.rentDay);

      const rentPaidMonth = form.getCheckBox("rentPaidMonth");
      const rentPaidOther = form.getCheckBox("rentPaidOther");
      leaseTermInfo.rentType === "month"
        ? rentPaidMonth.check()
        : leaseTermInfo.rentType === "other"
        ? rentPaidOther.check()
        : null;

      const txtRentOther = form.getField("txtRentOther");
      txtRentOther.setText(leaseTermInfo.otherRentDetails);

      const txtp_MonthlyRentAmount = form.getField("txtp_MonthlyRentAmount");
      txtp_MonthlyRentAmount.setText(leaseTermInfo.baseRent);

      const txtMonthlyParking = form.getField("txtMonthlyParking");
      txtMonthlyParking.setText(leaseTermInfo.parkingRent);

      const txtRentTotal = form.getField("txtRentTotal");
      txtRentTotal.setText(leaseTermInfo.totalRent);

      const txtRentPayable = form.getField("txtRentPayable");
      txtRentPayable.setText(leaseTermInfo.payTo);

      const txtRentMethod = form.getField("txtRentMethod");
      txtRentMethod.setText(leaseTermInfo.payMethod);

      const txtPartRent = form.getField("txtPartRent");
      txtPartRent.setText(leaseTermInfo.partRent);

      const txtPartRentPayOnDate = form.getField("txtPartRentPayOnDate");
      txtPartRentPayOnDate.setText(leaseTermInfo.partDate);

      const txtPartRentStartDate = form.getField("txtPartRentStartDate");
      txtPartRentStartDate.setText(leaseTermInfo.coverDateFrom);

      const txtPartRentEndDate = form.getField("txtPartRentEndDate");
      txtPartRentEndDate.setText(leaseTermInfo.coverDateTo);

      const txtAddFee = form.getField("txtAddFee");
      txtAddFee.setText(leaseTermInfo.nsfCharge);

      // Utility Info
      const gas_n = form.getCheckBox("gas_n");
      const gas_y = form.getCheckBox("gas_y");
      utilityInfo.gas === "yes" ? gas_y.check() : gas_n.check();

      const ac_n = form.getCheckBox("ac_n");
      const ac_y = form.getCheckBox("ac_y");
      utilityInfo.ac === "yes" ? ac_y.check() : ac_n.check();

      const addStore_n = form.getCheckBox("addStore_n");
      const addStore_y = form.getCheckBox("addStore_y");
      utilityInfo.addStore === "yes" ? addStore_y.check() : addStore_n.check();

      const laundry_n = form.getCheckBox("laundry_n");
      const laundry_y = form.getCheckBox("laundry_y");
      utilityInfo.laundry === "yes" ? laundry_y.check() : laundry_n.check();

      const guesp_n = form.getCheckBox("guesp_n");
      const guesp_y = form.getCheckBox("guesp_y");
      utilityInfo.guestPark === "yes" ? guesp_y.check() : guesp_n.check();

      const txtUtilAddDetails = form.getField("txtUtilAddDetails");
      txtUtilAddDetails.setText(utilityInfo.otherUtilText1);

      const elec_land = form.getCheckBox("elec_land");
      const elec_tent = form.getCheckBox("elec_tent");

      utilityInfo.electricity === "landlord"
        ? elec_land.check()
        : utilityInfo.electricity === "tenant"
        ? elec_tent.check()
        : null;

      const heat_land = form.getCheckBox("heat_land");
      const heat_tent = form.getCheckBox("heat_tent");

      utilityInfo.heat === "landlord"
        ? heat_land.check()
        : utilityInfo.heat === "tenant"
        ? heat_tent.check()
        : null;

      const water_land = form.getCheckBox("water_land");
      const water_tent = form.getCheckBox("water_tent");

      utilityInfo.water === "landlord"
        ? water_land.check()
        : utilityInfo.water === "tenant"
        ? water_tent.check()
        : null;

      // Deposit Info
      const dep_n = form.getCheckBox("dep_n");
      const dep_y = form.getCheckBox("dep_y");

      depositInfo.rentDeposit === "yes"
        ? dep_y.check()
        : depositInfo.rentDeposit === "no"
        ? dep_n.check()
        : null;

      const dep_amount = form.getField("dep_amount");
      dep_amount.setText(depositInfo.depositAmount);

      const rent_disc_n = form.getCheckBox("rent_disc_n");
      const rent_disc_y = form.getCheckBox("rent_disc_y");

      depositInfo.rentDiscount === "yes"
        ? rent_disc_y.check()
        : depositInfo.rentDiscount === "no"
        ? rent_disc_n.check()
        : null;

      const txtRentDiscAddDetails = form.getField("txtRentDiscAddDetails");
      txtRentDiscAddDetails.setText(depositInfo.rentDiscountDesc);

      const kdep_n = form.getField("kdep_n");
      const kdep_y = form.getField("kdep_y");

      depositInfo.keyDeposit === "yes"
        ? kdep_y.check()
        : depositInfo.keyDeposit === "no"
        ? kdep_n.check()
        : null;

      const txtKeyDeposit = form.getField("txtKeyDeposit");
      txtKeyDeposit.setText(depositInfo.keyDepAmount);

      const txtKeyDepositAddDetails = form.getField("txtKeyDepositAddDetails");
      txtKeyDepositAddDetails.setText(depositInfo.keyDepositDesc);

      const smk_n = form.getField("smk_n");
      const smk_y = form.getField("smk_y");

      depositInfo.smoking === "yes"
        ? smk_y.check()
        : depositInfo.smoking === "no"
        ? smk_n.check()
        : null;

      const txtSmokingAddDetails = form.getField("txtSmokingAddDetails");
      txtSmokingAddDetails.setText(depositInfo.smokingRules);

      const insur_n = form.getField("insur_n");
      const insur_y = form.getField("insur_y");

      depositInfo.tenantInsurance === "yes"
        ? insur_y.check()
        : depositInfo.tenantInsurance === "no"
        ? insur_n.check()
        : null;

      const addTerms_n = form.getCheckBox("addTerms_n");
      const addTerms_y = form.getCheckBox("addTerms_y");

      depositInfo.addTerm === "yes"
        ? addTerms_y.check()
        : depositInfo.addTerm === "no"
        ? addTerms_n.check()
        : null;

      // Signature Landlord
      const txtsellersig1 = form.getField("txtsellersig1");
      const txtsellersig2 = form.getField("txtsellersig2");
      const txtsellersig3 = form.getField("txtsellersig3");
      const txtsellersig4 = form.getField("txtsellersig4");

      txtsellersig1.setText(landlordSignature[0]?.landlordName ?? "");
      txtsellersig2.setText(landlordSignature[1]?.landlordName ?? "");
      txtsellersig3.setText(landlordSignature[2]?.landlordName ?? "");
      txtsellersig4.setText(landlordSignature[3]?.landlordName ?? "");

      const sig1_date = form.getField("sig1_date");
      const sig2_date = form.getField("sig2_date");
      const sig3_date = form.getField("sig3_date");
      const sig4_date = form.getField("sig4_date");

      sig1_date.setText(landlordSignature[0]?.landlordSignDate ?? "");
      sig2_date.setText(landlordSignature[1]?.landlordSignDate ?? "");
      sig3_date.setText(landlordSignature[2]?.landlordSignDate ?? "");
      sig4_date.setText(landlordSignature[3]?.landlordSignDate ?? "");

      try {
        await Promise.all(
          landlordSignature.map(async (landlord, index) => {
            try {
              if (!landlord.landlordSign) {
                console.log(
                  `Warning: Missing landlordSign data at index ${index}`
                );
                return;
              }
              const image = await pdfDoc.embedPng(landlord.landlordSign); // Assuming landlordSign is a Buffer or Uint8Array
              if (!image) {
                console.log(
                  `Warning: Failed to embed PNG image at index ${index}`
                );
                return;
              }
              const { width, height } = image.scale(0.17);
              const adjustments = {
                0: 35,
                1: 18,
                2: 10,
                3: 6,
              };
              const count =
                adjustments[index] !== undefined
                  ? adjustments[index]
                  : defaultValue;

              // Calculate Y position based on index
              const yPosition = 555 - index * 50 - count;

              // Draw the image on the page
              signPage.drawImage(image, {
                x: 300, // Adjust the X coordinate as needed
                y: yPosition, // Adjust the Y coordinate as needed
                width,
                height,
              });
            } catch (err) {
              console.log(
                err,
                "Error processing landlord sign at index",
                index
              );
            }
          })
        );
      } catch (error) {
        console.log(
          "An error occurred while processing landLordSignList:",
          error
        );
      }

      // Signature Tenant
      const txtbuyersig1 = form.getField("txtbuyersig1");
      const txtbuyersig2 = form.getField("txtbuyersig2");
      const txtbuyersig3 = form.getField("txtbuyersig3");
      const txtTenant5Sig = form.getField("txtTenant5Sig");
      const txtTenant6Sig = form.getField("txtTenant6Sig");

      txtbuyersig1.setText(tenantSignature[0]?.tenantName ?? "");
      txtbuyersig2.setText(tenantSignature[1]?.tenantName ?? "");
      txtbuyersig3.setText(tenantSignature[2]?.tenantName ?? "");
      txtTenant5Sig.setText(tenantSignature[3]?.tenantName ?? "");
      txtTenant6Sig.setText(tenantSignature[4]?.tenantName ?? "");

      const tsig1_date = form.getField("tsig1_date");
      const tsig2_date = form.getField("tsig2_date");
      const tsig3_date = form.getField("tsig3_date");
      const tsig4_date = form.getField("tsig4_date");

      tsig1_date.setText(tenantSignature[0]?.tenantSignDate ?? "");
      tsig2_date.setText(tenantSignature[1]?.tenantSignDate ?? "");
      tsig3_date.setText(tenantSignature[2]?.tenantSignDate ?? "");
      tsig4_date.setText(tenantSignature[3]?.tenantSignDate ?? "");

      try {
        await Promise.all(
          tenantSignature.map(async (tenant, index) => {
            try {
              if (!tenant.tenantSign) {
                console.log(
                  `Warning: Missing tenantSign data at index ${index}`
                );
                return;
              }
              const image = await pdfDoc.embedPng(tenant.tenantSign);
              if (!image) {
                console.log(
                  `Warning: Failed to embed PNG image at index ${index}`
                );
                return;
              }
              const { width, height } = image.scale(0.17);
              const adjustments = {
                0: 35,
                1: 18,
                2: 10,
                3: 6,
              };

              const count =
                adjustments[index] !== undefined
                  ? adjustments[index]
                  : defaultValue;

              const yPosition = 355 - index * 50 - count;

              signPage.drawImage(image, {
                x: 300,
                y: yPosition,
                width,
                height,
              });
            } catch (err) {
              console.log(err, "Error processing tenant sign at index", index);
            }
          })
        );
      } catch (error) {
        console.log(
          "An error occurred while processing tenantSignature:",
          error
        );
      }

      const pdfBytes = await pdfDoc.save();

      await writeFile(outputPath, pdfBytes);
    } catch (err) {
      console.error("Error in fillForm:", err);
    }
  }

  await fillForm(pdfPath, outputPath);
  res.download(outputPath, (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(500).send("Error sending the file");
    }
  });
});

app.listen(port, console.log(`http://127.0.0.1:${port}`));

// const txtUtilAddDetails2 = form.getField("txtUtilAddDetails2");
