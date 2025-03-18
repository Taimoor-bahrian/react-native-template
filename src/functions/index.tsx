import { DATE_TIME_FORMARTS } from "@app/constants"
import moment from "moment"

export const DateTime = ({ dateTime = null, format = DATE_TIME_FORMARTS.ddmmyyyy }) => moment(dateTime).format(format)