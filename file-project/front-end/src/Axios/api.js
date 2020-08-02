/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-17 17:34:06
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-19 23:10:18
 */
import { post } from './http'
const BASE_URL = 'http://localhost:3000'

export const uploadFileApi = async (form, config) =>
  post(`${BASE_URL}/files/upload`, form, config)

export const checkFileApi = async () => post(`${BASE_URL}/files/checkfile`)
