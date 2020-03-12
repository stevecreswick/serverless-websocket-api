const stage = process.env.STAGE;
const service = process.env.SERVICE;

export default {
  stage,
  service,
  dynamodb: {
    connections_table: `${service}-connections-${stage}`
  }
};
