export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};



export type ApprovePackageProposalInput = {
  proposalId: Scalars['ID'],
};

export type EditPackageProposalInfoInput = {
  proposalId: Scalars['ID'],
  info: PackageInfoInput,
  github?: Maybe<GitHubRepoInput>,
};

export type GitHubRepoInput = {
  owner: Scalars['String'],
  repo: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  togglePackageBookmark?: Maybe<Package>,
  indexPackages?: Maybe<Scalars['Boolean']>,
  indexPackage?: Maybe<Scalars['Boolean']>,
  resetProjectTypeTagCounters?: Maybe<Scalars['Boolean']>,
  approvePackageProposal?: Maybe<Package>,
  editPackageProposalInfo?: Maybe<PackageProposal>,
  proposePackage?: Maybe<PackageProposal>,
  togglePackageProposalUpvote?: Maybe<PackageProposal>,
  toggleProjectTypeBookmark?: Maybe<ProjectType>,
};


export type MutationTogglePackageBookmarkArgs = {
  input: TogglePackageBookmarkInput
};


export type MutationIndexPackageArgs = {
  id: Scalars['ID']
};


export type MutationApprovePackageProposalArgs = {
  input: ApprovePackageProposalInput
};


export type MutationEditPackageProposalInfoArgs = {
  input: EditPackageProposalInfoInput
};


export type MutationProposePackageArgs = {
  input: ProposePackageInput
};


export type MutationTogglePackageProposalUpvoteArgs = {
  input: TogglePackageProposalUpvoteInput
};


export type MutationToggleProjectTypeBookmarkArgs = {
  input: ToggleProjectTypeBookmarkInput
};

export type Package = {
   __typename?: 'Package',
  id: Scalars['ID'],
  name: Scalars['String'],
  projectType: ProjectType,
  maintainers: Array<PackageMaintainer>,
  description?: Maybe<Scalars['String']>,
  stars?: Maybe<Scalars['Int']>,
  repo?: Maybe<Scalars['String']>,
  homepage?: Maybe<Scalars['String']>,
  license?: Maybe<Scalars['String']>,
  defaultLogo?: Maybe<Scalars['String']>,
  bookmarked?: Maybe<Scalars['Boolean']>,
  readme?: Maybe<Scalars['String']>,
  info: PackageInfo,
};

export type PackageInfo = {
   __typename?: 'PackageInfo',
  tags: Array<Scalars['String']>,
};

export type PackageInfoInput = {
  tags: Array<Scalars['String']>,
};

export type PackageMaintainer = {
   __typename?: 'PackageMaintainer',
  name?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
};

export type PackageProposal = {
   __typename?: 'PackageProposal',
  id: Scalars['ID'],
  name: Scalars['String'],
  projectType: ProjectType,
  user?: Maybe<User>,
  maintainers: Array<PackageMaintainer>,
  description?: Maybe<Scalars['String']>,
  stars?: Maybe<Scalars['Int']>,
  repo?: Maybe<Scalars['String']>,
  homepage?: Maybe<Scalars['String']>,
  license?: Maybe<Scalars['String']>,
  defaultLogo?: Maybe<Scalars['String']>,
  readme?: Maybe<Scalars['String']>,
  info: PackageInfo,
  upvotes: Scalars['Int'],
  upvoted: Scalars['Boolean'],
};

export type ProjectType = {
   __typename?: 'ProjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  slug: Scalars['String'],
  logo: Scalars['String'],
  popularTags: Array<Scalars['String']>,
  packageProposals: Array<PackageProposal>,
  packageProposalCount: Scalars['Int'],
  packages: Array<Package>,
  bookmarked?: Maybe<Scalars['Boolean']>,
};


export type ProjectTypePackagesArgs = {
  tags?: Maybe<Array<Scalars['String']>>
};

export type ProposePackageInput = {
  projectTypeId: Scalars['ID'],
  packageName: Scalars['String'],
  tags: Array<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  currentUser?: Maybe<User>,
  packageProposal?: Maybe<PackageProposal>,
  packageProposalByName?: Maybe<PackageProposal>,
  package?: Maybe<Package>,
  packageByName?: Maybe<Package>,
  projectTypes: Array<ProjectType>,
  projectType?: Maybe<ProjectType>,
  projectTypeBySlug?: Maybe<ProjectType>,
};


export type QueryPackageProposalArgs = {
  id: Scalars['ID']
};


export type QueryPackageProposalByNameArgs = {
  name: Scalars['String']
};


export type QueryPackageArgs = {
  id: Scalars['ID']
};


export type QueryPackageByNameArgs = {
  name: Scalars['String']
};


export type QueryProjectTypeArgs = {
  id: Scalars['ID']
};


export type QueryProjectTypeBySlugArgs = {
  slug: Scalars['String']
};

export type TogglePackageBookmarkInput = {
  packageId: Scalars['ID'],
};

export type TogglePackageProposalUpvoteInput = {
  proposalId: Scalars['ID'],
};

export type ToggleProjectTypeBookmarkInput = {
  projectTypeId: Scalars['ID'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  nickname: Scalars['String'],
  email: Scalars['String'],
  accounts: Array<UserAccount>,
  avatar?: Maybe<Scalars['String']>,
  admin?: Maybe<Scalars['Boolean']>,
  bookmarkedPackages: Array<Package>,
};

export type UserAccount = {
   __typename?: 'UserAccount',
  id: Scalars['ID'],
  provider: Scalars['String'],
  profileId: Scalars['ID'],
  nickname?: Maybe<Scalars['String']>,
  profileUrl?: Maybe<Scalars['String']>,
};
