export type DemoAppMetadata = {
  title: string;
  link: string;
  description: string;
  randomLinks?: string[];
};

export const smartSessionsDemoAppMetadata: DemoAppMetadata[] = [
  {
    title: "Registry",
    link: "/demo/registry",
    description: "Registry Experiment",
  }
];
