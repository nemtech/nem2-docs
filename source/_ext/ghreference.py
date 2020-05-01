# -*- encoding: utf-8 -*-
#
# (c) 2020 NEM
# This code is licensed under Apache 2.0 (see LICENSE.md for details)

import os
import requests
from github import Github
from docutils.parsers.rst import directives, Directive, nodes


class GitHubReference(Directive):
    has_content = True
    required_arguments = 1
    optional_arguments = 1
    final_argument_whitespace = True
    option_spec = {
        'folder': directives.unchanged,
    }
    excluded_file_names = ['SNAPSHOT', '.nojekyll', 'template']
    docs_url = 'https://nemtech.github.io/'

    def run(self):
        node_list = nodes.bullet_list()

        token = os.getenv('GITHUB_TOKEN')
        if token:
            g = Github(token)
            repo = g.get_repo(self.arguments[0])
            folder = '' if not self.options['folder'] else self.options['folder']
            contents = repo.get_contents(folder, ref="gh-pages")

            count = 1
            for line in list(reversed(contents)):

                if '.md' in line.path:
                    uri = 'https://github.com/' + self.arguments[0] + '/blob/gh-pages/' + line.path
                    version = line.path.split('.md')[0]
                else:
                    uri = self.docs_url + self.arguments[0].split('/')[1] + '/' + line.path
                    version = line.path.split('/')[-1]

                if count == 1:
                    version = version + ' (next)'
                elif count == 2:
                    version = version + ' (latest)'

                if not any(excluded_file_name in version for excluded_file_name in self.excluded_file_names):
                    item = nodes.list_item()
                    item_p = nodes.paragraph()
                    item_p += nodes.reference(text=version, refuri=uri)
                    item += item_p
                    node_list += item

                count += 1

        return [node_list]


def setup(app):
    app.add_directive('ghreference', GitHubReference)
