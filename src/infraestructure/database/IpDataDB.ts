import { Injectable } from '@nestjs/common';
import { ConnectionDB } from './ConnectionDB';

@Injectable()
export class IpDataDB {
  async getIpData(ip: string) {
    const connection = await ConnectionDB.getInstance().getConnection();
    try {
      const [rows]: any[] = await connection.query(
        `SELECT ip FROM GeoData WHERE ip = ?`,
        [ip],
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async saveIpData(data: any) {
    const connection = await ConnectionDB.getInstance().getConnection();
    try {
      const rows = await this.getIpData(data.ip);
      if (rows === null) {
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
      throw error;
    } finally {
      connection.release();
    }
  }
}
