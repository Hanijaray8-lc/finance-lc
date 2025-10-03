import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function CompanyAppCount() {
  const [companies, setCompanies] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/financecompanies")
      .then(async (res) => {
        const fetchedCompanies = res.data;

        // Fetch counts for each company
        const companiesWithCounts = await Promise.all(
          fetchedCompanies.map(async (company) => {
            try {
              const countRes = await axios.get(
                `http://localhost:5000/api/loan/company/${company.companyId}/application-count`

              );
              return {
                ...company,
                users: countRes.data.applicationCount || 0
              };
            } catch (err) {
              console.error(err);
              return { ...company, users: 0 };
            }
          })
        );

        setCompanies(companiesWithCounts);
        setTotalUsers(
          companiesWithCounts.reduce((sum, c) => sum + c.users, 0)
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "medium", mb: 3 }}
            >
              Company-wise Applied User Distribution
            </Typography>

            <Paper elevation={0} sx={{ maxHeight: 500, overflow: "auto" }}>
              {companies.map((company) => (
                <Accordion
                  key={company.companyId}
                  expanded={expanded === company.companyId}
                  onChange={handleChange(company.companyId)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${company.companyId}-content`}
                    id={`panel${company.companyId}-header`}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {company.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Applied Users Count"
                          secondary={company.users.toLocaleString()}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Percentage"
                          secondary={`${(
                            (company.users / totalUsers) *
                            100
                          ).toFixed(1)}%`}
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "medium", mb: 3 }}
            >
              Applied User Distribution Chart
            </Typography>

            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={companies}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="users"
                    name="Applied Users"
                    fill="#1976d2"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

