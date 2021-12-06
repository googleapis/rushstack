import { AlreadyReportedError } from '@rushstack/node-core-library';

import type { RushConfiguration } from '../../api/RushConfiguration';
import type { RushConfigurationProject } from '../../api/RushConfigurationProject';
import type { IEvaluateSelectorOptions, ISelectorParser } from './ISelectorParser';

export class VersionPolicyProjectSelectorParser implements ISelectorParser<RushConfigurationProject> {
  private readonly _rushConfiguration: RushConfiguration;

  public constructor(rushConfiguration: RushConfiguration) {
    this._rushConfiguration = rushConfiguration;
  }

  public async evaluateSelectorAsync({
    unscopedSelector,
    terminal,
    parameterName
  }: IEvaluateSelectorOptions): Promise<Iterable<RushConfigurationProject>> {
    const selection: Set<RushConfigurationProject> = new Set();

    if (!this._rushConfiguration.versionPolicyConfiguration.versionPolicies.has(unscopedSelector)) {
      terminal.writeErrorLine(
        `The version policy "${unscopedSelector}" passed to "${parameterName}" does not exist in version-policies.json.`
      );
      throw new AlreadyReportedError();
    }

    for (const project of this._rushConfiguration.projects) {
      if (project.versionPolicyName === unscopedSelector) {
        selection.add(project);
      }
    }

    return selection;
  }

  public getCompletions(): Iterable<string> {
    return this._rushConfiguration.versionPolicyConfiguration.versionPolicies.keys();
  }
}
