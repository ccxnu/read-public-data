import { ConnectionDB } from './ConnectionDB';

export class IPublicDataDB {
  public async saveIpData(data: any) {
    const connection = await ConnectionDB.getInstance().getConnection();
    try {
      const [rows]: any[] = await connection.query(
        `SELECT ip, creation_datetime FROM GeoData WHERE ip = ?`,
        [data.ip],
      );
      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO GeoData (ip, country, countryCode, region, regionName, city, zip, latitud, longitud, timezone, isp, org, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.ip,
            data.country,
            data.countryCode,
            data.region,
            data.regionName,
            data.city,
            data.zip,
            data.lat,
            data.lon,
            data.timezone,
            data.isp,
            data.org,
            data.proveedor,
          ],
        );
      } else {
        console.log(`IP ${data.ip} already exists in the database.`); // Development
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      connection.release();
    }
  }
}
