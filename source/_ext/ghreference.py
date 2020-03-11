# -*- encoding: utf-8 -*-
#
# (c) 2020 NEM
# This code is licensed under Apache 2.0 (see LICENSE.md for details)

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
    excluded_file_names = ['SNAPSHOT', '.nojekyll']

    def run(self):
        g = Github()
        base_url = 'https://nemtech.github.io/'
        base_url += self.arguments[0].split('/')[1]
        repo = g.get_repo(self.arguments[0])
        folder = '' if not self.options['folder'] else self.options['folder']
        contents = repo.get_contents(folder, ref="gh-pages")
        node_list = nodes.bullet_list()
        for line in list(reversed(contents)):
            uri = base_url + '/' + line.path
            version = line.path.split('/')[-1]
            if not any(excluded_file_name in version for excluded_file_name in self.excluded_file_names):
                item = nodes.list_item()
                item_p = nodes.paragraph()
                item_p += nodes.reference(text=version, refuri=uri)
                item += item_p
                node_list += item
        return [node_list]


def setup(app):
    app.add_directive('ghreference', GitHubReference)
