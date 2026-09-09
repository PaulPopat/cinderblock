#include "./Instruction.h"
#include "./LiteralString.h"
#include <vector>

namespace Binary
{
  class CreateFunc
  {
  public:
    CreateFunc(char *binary, int offset);
    ~CreateFunc();
    const int get_end() const;

  private:
    LiteralString *name;
    bool no_args;
    std::vector<CreateFunc *> vars;
    Instruction *returns;
    int end;
  };
}