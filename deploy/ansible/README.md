### What

Configuration files (Playbooks) for [Ansible](http://www.ansible.com/)

### Match your server

To run them, install Ansible then change hosts and site.yml files to match your
server configuration.

### Run

Once done, run this command in the ansible (the current one) folder:

    ansible-playbook site.yml -i hosts
