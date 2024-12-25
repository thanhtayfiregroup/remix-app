import { useLoaderData, useSubmit } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  InlineGrid,
  Page,
  Select,
  Text,
  useBreakpoints,
} from "@shopify/polaris";
import { useCallback, useState } from 'react';
import { authenticate } from "../shopify.server";


import { type ActionFunction, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  console.log("Admin", admin);

  let settings = {
    status: false,
    layout: 'layout_2',
  }
  return Response.json(settings);
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const status = formData.get("status") === "on";
  const layout = formData.get("layout") as string;

  // Handle saving the data here
  // Example: Save to database, call API, etc.

  return Response.json({ status, layout });
};

export default function SettingsPage() {
  const submit = useSubmit();

  const { smUp } = useBreakpoints();
  const settings = useLoaderData<typeof loader>();

  const [selected, setSelected] = useState(settings.layout);

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const optionsLayout = [
    { label: 'Layout 1', value: 'layout_1' },
    { label: 'Layout 2', value: 'layout_2' },
    { label: 'Layout 3', value: 'layout_3' },
  ];

  const [checked, setChecked] = useState(settings.status);
  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget);
  };

  return (
    <Page>
      <TitleBar title="Settings" />
      <Form method="post" onSubmit={handleSubmit}>
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  General settings
                </Text>
                <Text as="p" variant="bodyMd">
                  Active settings for your app
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <Checkbox
                  label="Active App"
                  checked={checked}
                  onChange={handleChange}
                  name="status"

                />
              </BlockStack>
            </Card>
          </InlineGrid>
          {smUp ? <Divider /> : null}
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Store Font
                </Text>
                <Text as="p" variant="bodyMd">
                  Setting for your app layout
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <Select
                  label="Choose Layout"
                  options={optionsLayout}
                  onChange={handleSelectChange}
                  value={selected}
                  name="layout"
                />
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>
        <Button submit={true}>Save</Button>
      </Form>
    </Page>
  );
}

