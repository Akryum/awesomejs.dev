import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DBPackageProposal } from '@/schema/package-proposal/db-types';
import { DBProjectType } from '@/schema/project-type/db-types';
import { Context } from '@/context';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
  /** Date timestamp. It's serialized as a time number in ms, for example `1550923964562`. */
  Date: any,
};



export type ApprovePackageProposalInput = {
  proposalId: Scalars['ID'],
};


export type EditPackageInfoInput = {
  packageId: Scalars['ID'],
  info: PackageInfoInput,
  github?: Maybe<GitHubRepoInput>,
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
  editPackageInfo?: Maybe<Package>,
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


export type MutationEditPackageInfoArgs = {
  input: EditPackageInfoInput
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
  readme?: Maybe<Scalars['String']>,
  info: PackageInfo,
  bookmarked?: Maybe<Scalars['Boolean']>,
  dataSources: Array<PackageDataSource>,
  releases: Array<PackageRelease>,
};

export type PackageDataSource = {
   __typename?: 'PackageDataSource',
  type: Scalars['String'],
  data?: Maybe<Scalars['JSON']>,
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

export type PackageRelease = {
   __typename?: 'PackageRelease',
  id: Scalars['ID'],
  date?: Maybe<Scalars['Date']>,
  title?: Maybe<Scalars['String']>,
  tagName?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  prerelease?: Maybe<Scalars['Boolean']>,
  assets: Array<PackageReleaseAsset>,
};

export type PackageReleaseAsset = {
   __typename?: 'PackageReleaseAsset',
  name: Scalars['String'],
  downloadUrl: Scalars['String'],
  size: Scalars['Int'],
};

export type PackagesPage = {
   __typename?: 'PackagesPage',
  items: Array<Package>,
  after?: Maybe<Scalars['JSON']>,
};

export type ProjectType = {
   __typename?: 'ProjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  slug: Scalars['String'],
  logo: Scalars['String'],
  popularTags: Array<Tag>,
  tags: Array<Tag>,
  packageProposals: Array<PackageProposal>,
  packageProposalCount: Scalars['Int'],
  packages: PackagesPage,
  bookmarked?: Maybe<Scalars['Boolean']>,
};


export type ProjectTypePackagesArgs = {
  tags?: Maybe<Array<Scalars['String']>>,
  after?: Maybe<Scalars['JSON']>
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

export type Tag = {
   __typename?: 'Tag',
  id: Scalars['ID'],
  count: Scalars['Int'],
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



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<Omit<User, 'bookmarkedPackages'> & { bookmarkedPackages: Array<ResolversTypes['Package']> }>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  UserAccount: ResolverTypeWrapper<UserAccount>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Package: ResolverTypeWrapper<Omit<Package, 'projectType'> & { projectType: ResolversTypes['ProjectType'] }>,
  ProjectType: ResolverTypeWrapper<DBProjectType>,
  Tag: ResolverTypeWrapper<Tag>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  PackageProposal: ResolverTypeWrapper<DBPackageProposal>,
  PackageMaintainer: ResolverTypeWrapper<PackageMaintainer>,
  PackageInfo: ResolverTypeWrapper<PackageInfo>,
  JSON: ResolverTypeWrapper<Scalars['JSON']>,
  PackagesPage: ResolverTypeWrapper<Omit<PackagesPage, 'items'> & { items: Array<ResolversTypes['Package']> }>,
  PackageDataSource: ResolverTypeWrapper<PackageDataSource>,
  PackageRelease: ResolverTypeWrapper<PackageRelease>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  PackageReleaseAsset: ResolverTypeWrapper<PackageReleaseAsset>,
  Mutation: ResolverTypeWrapper<{}>,
  TogglePackageBookmarkInput: TogglePackageBookmarkInput,
  ApprovePackageProposalInput: ApprovePackageProposalInput,
  EditPackageProposalInfoInput: EditPackageProposalInfoInput,
  PackageInfoInput: PackageInfoInput,
  GitHubRepoInput: GitHubRepoInput,
  ProposePackageInput: ProposePackageInput,
  TogglePackageProposalUpvoteInput: TogglePackageProposalUpvoteInput,
  EditPackageInfoInput: EditPackageInfoInput,
  ToggleProjectTypeBookmarkInput: ToggleProjectTypeBookmarkInput,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  User: Omit<User, 'bookmarkedPackages'> & { bookmarkedPackages: Array<ResolversParentTypes['Package']> },
  ID: Scalars['ID'],
  String: Scalars['String'],
  UserAccount: UserAccount,
  Boolean: Scalars['Boolean'],
  Package: Omit<Package, 'projectType'> & { projectType: ResolversParentTypes['ProjectType'] },
  ProjectType: DBProjectType,
  Tag: Tag,
  Int: Scalars['Int'],
  PackageProposal: DBPackageProposal,
  PackageMaintainer: PackageMaintainer,
  PackageInfo: PackageInfo,
  JSON: Scalars['JSON'],
  PackagesPage: Omit<PackagesPage, 'items'> & { items: Array<ResolversParentTypes['Package']> },
  PackageDataSource: PackageDataSource,
  PackageRelease: PackageRelease,
  Date: Scalars['Date'],
  PackageReleaseAsset: PackageReleaseAsset,
  Mutation: {},
  TogglePackageBookmarkInput: TogglePackageBookmarkInput,
  ApprovePackageProposalInput: ApprovePackageProposalInput,
  EditPackageProposalInfoInput: EditPackageProposalInfoInput,
  PackageInfoInput: PackageInfoInput,
  GitHubRepoInput: GitHubRepoInput,
  ProposePackageInput: ProposePackageInput,
  TogglePackageProposalUpvoteInput: TogglePackageProposalUpvoteInput,
  EditPackageInfoInput: EditPackageInfoInput,
  ToggleProjectTypeBookmarkInput: ToggleProjectTypeBookmarkInput,
};

export type AdminDirectiveResolver<Result, Parent, ContextType = Context, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthDirectiveResolver<Result, Parent, ContextType = Context, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  togglePackageBookmark?: Resolver<Maybe<ResolversTypes['Package']>, ParentType, ContextType, RequireFields<MutationTogglePackageBookmarkArgs, 'input'>>,
  indexPackages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  indexPackage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationIndexPackageArgs, 'id'>>,
  resetProjectTypeTagCounters?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  approvePackageProposal?: Resolver<Maybe<ResolversTypes['Package']>, ParentType, ContextType, RequireFields<MutationApprovePackageProposalArgs, 'input'>>,
  editPackageProposalInfo?: Resolver<Maybe<ResolversTypes['PackageProposal']>, ParentType, ContextType, RequireFields<MutationEditPackageProposalInfoArgs, 'input'>>,
  proposePackage?: Resolver<Maybe<ResolversTypes['PackageProposal']>, ParentType, ContextType, RequireFields<MutationProposePackageArgs, 'input'>>,
  togglePackageProposalUpvote?: Resolver<Maybe<ResolversTypes['PackageProposal']>, ParentType, ContextType, RequireFields<MutationTogglePackageProposalUpvoteArgs, 'input'>>,
  editPackageInfo?: Resolver<Maybe<ResolversTypes['Package']>, ParentType, ContextType, RequireFields<MutationEditPackageInfoArgs, 'input'>>,
  toggleProjectTypeBookmark?: Resolver<Maybe<ResolversTypes['ProjectType']>, ParentType, ContextType, RequireFields<MutationToggleProjectTypeBookmarkArgs, 'input'>>,
};

export type PackageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Package'] = ResolversParentTypes['Package']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  projectType?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
  maintainers?: Resolver<Array<ResolversTypes['PackageMaintainer']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  stars?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  repo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  license?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  defaultLogo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  readme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  info?: Resolver<ResolversTypes['PackageInfo'], ParentType, ContextType>,
  bookmarked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  dataSources?: Resolver<Array<ResolversTypes['PackageDataSource']>, ParentType, ContextType>,
  releases?: Resolver<Array<ResolversTypes['PackageRelease']>, ParentType, ContextType>,
};

export type PackageDataSourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageDataSource'] = ResolversParentTypes['PackageDataSource']> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
};

export type PackageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageInfo'] = ResolversParentTypes['PackageInfo']> = {
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
};

export type PackageMaintainerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageMaintainer'] = ResolversParentTypes['PackageMaintainer']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type PackageProposalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageProposal'] = ResolversParentTypes['PackageProposal']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  projectType?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  maintainers?: Resolver<Array<ResolversTypes['PackageMaintainer']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  stars?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  repo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  license?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  defaultLogo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  readme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  info?: Resolver<ResolversTypes['PackageInfo'], ParentType, ContextType>,
  upvotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  upvoted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
};

export type PackageReleaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageRelease'] = ResolversParentTypes['PackageRelease']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tagName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  prerelease?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  assets?: Resolver<Array<ResolversTypes['PackageReleaseAsset']>, ParentType, ContextType>,
};

export type PackageReleaseAssetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageReleaseAsset'] = ResolversParentTypes['PackageReleaseAsset']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  downloadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type PackagesPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackagesPage'] = ResolversParentTypes['PackagesPage']> = {
  items?: Resolver<Array<ResolversTypes['Package']>, ParentType, ContextType>,
  after?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
};

export type ProjectTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectType'] = ResolversParentTypes['ProjectType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  logo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  popularTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>,
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>,
  packageProposals?: Resolver<Array<ResolversTypes['PackageProposal']>, ParentType, ContextType>,
  packageProposalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  packages?: Resolver<ResolversTypes['PackagesPage'], ParentType, ContextType, RequireFields<ProjectTypePackagesArgs, 'tags' | 'after'>>,
  bookmarked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  packageProposal?: Resolver<Maybe<ResolversTypes['PackageProposal']>, ParentType, ContextType, RequireFields<QueryPackageProposalArgs, 'id'>>,
  packageProposalByName?: Resolver<Maybe<ResolversTypes['PackageProposal']>, ParentType, ContextType, RequireFields<QueryPackageProposalByNameArgs, 'name'>>,
  package?: Resolver<Maybe<ResolversTypes['Package']>, ParentType, ContextType, RequireFields<QueryPackageArgs, 'id'>>,
  packageByName?: Resolver<Maybe<ResolversTypes['Package']>, ParentType, ContextType, RequireFields<QueryPackageByNameArgs, 'name'>>,
  projectTypes?: Resolver<Array<ResolversTypes['ProjectType']>, ParentType, ContextType>,
  projectType?: Resolver<Maybe<ResolversTypes['ProjectType']>, ParentType, ContextType, RequireFields<QueryProjectTypeArgs, 'id'>>,
  projectTypeBySlug?: Resolver<Maybe<ResolversTypes['ProjectType']>, ParentType, ContextType, RequireFields<QueryProjectTypeBySlugArgs, 'slug'>>,
};

export type TagResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nickname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  accounts?: Resolver<Array<ResolversTypes['UserAccount']>, ParentType, ContextType>,
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  admin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  bookmarkedPackages?: Resolver<Array<ResolversTypes['Package']>, ParentType, ContextType>,
};

export type UserAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  profileId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  profileUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = Context> = {
  Date?: GraphQLScalarType,
  JSON?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Package?: PackageResolvers<ContextType>,
  PackageDataSource?: PackageDataSourceResolvers<ContextType>,
  PackageInfo?: PackageInfoResolvers<ContextType>,
  PackageMaintainer?: PackageMaintainerResolvers<ContextType>,
  PackageProposal?: PackageProposalResolvers<ContextType>,
  PackageRelease?: PackageReleaseResolvers<ContextType>,
  PackageReleaseAsset?: PackageReleaseAssetResolvers<ContextType>,
  PackagesPage?: PackagesPageResolvers<ContextType>,
  ProjectType?: ProjectTypeResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Tag?: TagResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  UserAccount?: UserAccountResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = Context> = {
  admin?: AdminDirectiveResolver<any, any, ContextType>,
  auth?: AuthDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<ContextType>;